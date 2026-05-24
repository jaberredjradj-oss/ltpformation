import { NextResponse } from "next/server";
import { getDocumentForDownload } from "@/lib/documents/actions";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  try {
    const result = await getDocumentForDownload(id);
    if (!result) {
      return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
    }

    const { document, bytes } = result;

    return new NextResponse(new Uint8Array(bytes), {
      status: 200,
      headers: {
        "Content-Type": document.mimeType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(document.fileName)}"`,
        "Content-Length": String(document.sizeBytes),
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }
}
