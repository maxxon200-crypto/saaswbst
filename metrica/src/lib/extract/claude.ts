import Anthropic from "@anthropic-ai/sdk";
import { extractionSchema, type ExtractionResult } from "./schema";
import { EXTRACTION_SYSTEM_PROMPT } from "./prompt";
import { ExtractError } from "./errors";

// Vision-capable Sonnet. Centralised so the whole pipeline moves models together.
export const EXTRACTION_MODEL = "claude-sonnet-5";

export function anthropicConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export interface ExtractionUsage {
  tokensIn: number;
  tokensOut: number;
}

function stripToJson(text: string): string {
  let t = text.trim();
  const fence = t.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fence?.[1]) t = fence[1].trim();
  const first = t.indexOf("{");
  const last = t.lastIndexOf("}");
  if (first !== -1 && last > first) t = t.slice(first, last + 1);
  return t;
}

function tryParse(text: string): ExtractionResult | null {
  try {
    const parsed = extractionSchema.safeParse(JSON.parse(stripToJson(text)));
    return parsed.success ? parsed.data : null;
  } catch {
    return null;
  }
}

const textOf = (msg: Anthropic.Message): string =>
  msg.content
    .filter((b): b is Anthropic.TextBlock => b.type === "text")
    .map((b) => b.text)
    .join("\n");

/**
 * Sends the assembled content blocks to Claude with the strict-JSON system
 * prompt, strips any fences, and parses. Exactly one retry on parse failure.
 */
export async function runExtraction(
  blocks: Anthropic.Messages.ContentBlockParam[],
  opts: { signal?: AbortSignal } = {},
): Promise<{ result: ExtractionResult; usage: ExtractionUsage }> {
  const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  const call = async (nudge?: string): Promise<Anthropic.Message> => {
    const content = nudge
      ? [...blocks, { type: "text" as const, text: nudge }]
      : blocks;
    try {
      return await client.messages.create(
        {
          model: EXTRACTION_MODEL,
          max_tokens: 1600,
          system: EXTRACTION_SYSTEM_PROMPT,
          messages: [{ role: "user", content }],
        },
        { signal: opts.signal },
      );
    } catch (e) {
      if (opts.signal?.aborted) {
        throw new ExtractError("timeout", "Extraction timed out.");
      }
      throw new ExtractError(
        "anthropic_error",
        e instanceof Error ? e.message : "Anthropic request failed.",
      );
    }
  };

  let msg = await call();
  let parsed = tryParse(textOf(msg));

  if (!parsed) {
    msg = await call(
      "Return ONLY the JSON object described. No prose, no markdown fences.",
    );
    parsed = tryParse(textOf(msg));
    if (!parsed) {
      throw new ExtractError("parse_failed", "Model did not return valid JSON.");
    }
  }

  return {
    result: parsed,
    usage: { tokensIn: msg.usage.input_tokens, tokensOut: msg.usage.output_tokens },
  };
}
