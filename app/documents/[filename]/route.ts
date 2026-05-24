import { NextResponse } from "next/server";
import { getLegalDocumentByPdfFilename } from "@/lib/legal";
import { generateLegalDocumentPdf } from "@/lib/pdf/generate-legal-document";

interface RouteContext {
  params: Promise<{ filename: string }>;
}

export async function GET(_request: Request, context: RouteContext) {
  const { filename } = await context.params;
  const document = getLegalDocumentByPdfFilename(filename);

  if (!document) {
    return NextResponse.json({ error: "Document introuvable." }, { status: 404 });
  }

  const bytes = await generateLegalDocumentPdf(document);

  return new NextResponse(Buffer.from(bytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${document.pdfFilename}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=86400",
    },
  });
}
