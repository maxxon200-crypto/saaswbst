import Anthropic from "@anthropic-ai/sdk";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ExtractError } from "./errors";

type ContentBlock = Anthropic.Messages.ContentBlockParam;
type ImageMedia = "image/jpeg" | "image/png" | "image/gif" | "image/webp";

const IMAGE_MEDIA: readonly ImageMedia[] = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
];

const FETCH_TIMEOUT_MS = 15_000;
const MAX_TEXT_CHARS = 12_000;
const MAX_IMAGE_BYTES = 4_500_000;

function asImageMedia(contentType: string): ImageMedia | null {
  const base = contentType.split(";")[0]!.trim().toLowerCase();
  return IMAGE_MEDIA.includes(base as ImageMedia) ? (base as ImageMedia) : null;
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function extractOgImage(html: string, base: string): string | null {
  const m =
    html.match(
      /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    ) ||
    html.match(
      /<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i,
    );
  if (!m?.[1]) return null;
  try {
    return new URL(m[1], base).href;
  } catch {
    return null;
  }
}

async function tryImageBlock(url: string): Promise<ContentBlock | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const media = asImageMedia(res.headers.get("content-type") ?? "");
    if (!media) return null;
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length === 0 || buf.length > MAX_IMAGE_BYTES) return null;
    return {
      type: "image",
      source: { type: "base64", media_type: media, data: buf.toString("base64") },
    };
  } catch {
    return null;
  }
}

/**
 * URL mode. Fetches the page server-side, reduces it to readable text, and
 * attaches the product's og:image so Claude can read the visual too. A rendered
 * full-page screenshot (via @sparticuz/chromium + puppeteer-core on Vercel) is
 * the documented production upgrade; text + product image already extract
 * reliably and add no heavy native dependency.
 */
export async function urlBlocks(url: string): Promise<ContentBlock[]> {
  let html: string;
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);
    const res = await fetch(url, {
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent":
          "Mozilla/5.0 (compatible; MetricaBot/1.0; +https://metrica.studio/bot)",
        accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    html = await res.text();
  } catch (e) {
    // Bot-blocking or a dead link — surface a typed error; the UI offers the
    // manual form or the PDF path instead of crashing.
    throw new ExtractError(
      "fetch_failed",
      `Could not read that page (${e instanceof Error ? e.message : "network error"}). Try uploading the PDF cut-sheet, or add it manually.`,
    );
  }

  const text = htmlToText(html).slice(0, MAX_TEXT_CHARS);
  const blocks: ContentBlock[] = [
    {
      type: "text",
      text: `Extract the FF&E product from this supplier page.\nSource URL: ${url}\n\nReadable page text:\n${text}`,
    },
  ];

  const ogImage = extractOgImage(html, url);
  if (ogImage) {
    const img = await tryImageBlock(ogImage);
    if (img) blocks.push(img);
  }
  return blocks;
}

/**
 * File mode — the reason Metrica exists. Downloads the uploaded cut-sheet from
 * Storage and hands it to Claude: PDFs as a native document block (handles
 * scanned sheets via vision, no canvas rasterisation), images as image blocks.
 */
export async function fileBlocks(
  storagePath: string,
  bucket = "source-files",
): Promise<ContentBlock[]> {
  const admin = createSupabaseAdminClient();
  const { data, error } = await admin.storage.from(bucket).download(storagePath);
  if (error || !data) {
    throw new ExtractError("file_failed", "Could not read the uploaded file.");
  }

  const bytes = Buffer.from(await data.arrayBuffer());
  const contentType = data.type || guessMediaFromPath(storagePath);
  const instruction: ContentBlock = {
    type: "text",
    text: "Extract the FF&E product from this manufacturer document or image.",
  };

  if (contentType.startsWith("application/pdf")) {
    return [
      instruction,
      {
        type: "document",
        source: {
          type: "base64",
          media_type: "application/pdf",
          data: bytes.toString("base64"),
        },
      },
    ];
  }

  const media = asImageMedia(contentType);
  if (!media) {
    throw new ExtractError(
      "file_failed",
      "Unsupported file type. Upload a PDF, JPG, PNG or WebP.",
    );
  }
  return [
    instruction,
    { type: "image", source: { type: "base64", media_type: media, data: bytes.toString("base64") } },
  ];
}

function guessMediaFromPath(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/jpeg";
  }
}
