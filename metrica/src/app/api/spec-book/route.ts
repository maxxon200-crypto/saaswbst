import React from "react";
import { renderToBuffer } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
import { getProjectBundle } from "@/lib/data/projects";
import { getStudioContext } from "@/lib/studio";
import { registerFonts } from "@/lib/pdf/register";
import { SpecBook } from "@/lib/pdf/SpecBook";
import { Tearsheet } from "@/lib/pdf/Tearsheet";
import { parseSpecBookOptions } from "@/lib/pdf/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get("project");
  if (!projectId) return new NextResponse("Missing project", { status: 400 });

  const bundle = await getProjectBundle(projectId);
  if (!bundle) return new NextResponse("Not found", { status: 404 });

  const ctx = await getStudioContext();
  registerFonts();

  const download = searchParams.get("download") === "1";
  const itemId = searchParams.get("item");

  let element: React.ReactElement;
  let filename: string;

  if (itemId) {
    const item = bundle.items.find((i) => i.id === itemId);
    if (!item) return new NextResponse("Item not found", { status: 404 });
    element = React.createElement(Tearsheet, {
      item,
      project: bundle.project,
      studioName: ctx.studioName,
    });
    filename = `${item.product?.name ?? "product"}-tearsheet.pdf`;
  } else {
    element = React.createElement(SpecBook, {
      bundle,
      options: parseSpecBookOptions(searchParams),
      studioName: ctx.studioName,
    });
    filename = `${bundle.project.name}-spec-book.pdf`;
  }

  const buffer = await renderToBuffer(element);
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "content-type": "application/pdf",
      "content-disposition": `${download ? "attachment" : "inline"}; filename*=UTF-8''${encodeURIComponent(filename)}`,
      "cache-control": "no-store",
    },
  });
}
