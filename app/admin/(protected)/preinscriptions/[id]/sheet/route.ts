import { NextResponse, type NextRequest } from "next/server";
import { assertAdminAccess } from "@/lib/admin/auth";
import { getPreinscriptionSheetData } from "@/lib/admin/preinscription-sheet";
import {
  buildPreinscriptionSheetFilename,
  generatePreinscriptionSheetPdf,
} from "@/lib/pdf/generate-preinscription-sheet";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    await assertAdminAccess();
  } catch {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  const { id } = await context.params;
  const data = await getPreinscriptionSheetData(id);

  if (!data) {
    return NextResponse.json({ error: "Pré-inscription introuvable." }, { status: 404 });
  }

  const pdfBytes = await generatePreinscriptionSheetPdf(data);
  const download = request.nextUrl.searchParams.get("download") === "1";
  const filename = buildPreinscriptionSheetFilename(data);

  return new NextResponse(Buffer.from(pdfBytes), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${download ? "attachment" : "inline"}; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
