import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { EDITOR_UPLOAD_TYPES, getUploadDirectory, isSafeUploadName } from "@/lib/server/uploads";

export const runtime = "nodejs";

const CONTENT_TYPES = new Map(Array.from(EDITOR_UPLOAD_TYPES, ([contentType, extension]) => [extension.slice(1), contentType]));

export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  if (!isSafeUploadName(name)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const content = await readFile(path.join(getUploadDirectory(), name));
    const extension = name.slice(name.lastIndexOf(".") + 1);

    return new NextResponse(content, {
      headers: {
        "Content-Type": CONTENT_TYPES.get(extension) ?? "application/octet-stream",
        "Content-Disposition": extension === "pdf" ? `attachment; filename="${name}"` : `inline; filename="${name}"`,
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
