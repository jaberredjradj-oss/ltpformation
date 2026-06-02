import { readFile } from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { SITE } from "@/lib/constants";
import type { PreinscriptionSheetData } from "@/lib/pdf/preinscription-sheet-types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 48;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

const NAVY = rgb(0.04, 0.12, 0.22);
const SLATE = rgb(0.35, 0.39, 0.45);
const BORDER = rgb(0.82, 0.86, 0.9);
const ACCENT = rgb(0.11, 0.37, 0.69);

function wrapText(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxChars && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
  }

  if (current) lines.push(current);
  return lines.length > 0 ? lines : [""];
}

function drawLabelValue(
  page: ReturnType<PDFDocument["getPages"]>[number],
  fontBold: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  font: Awaited<ReturnType<PDFDocument["embedFont"]>>,
  x: number,
  y: number,
  label: string,
  value: string,
  width: number,
): number {
  page.drawText(label, { x, y, size: 8.5, font: fontBold, color: SLATE });
  const lines = wrapText(value || "—", Math.floor(width / 5.2));
  let cursorY = y - 14;
  for (const line of lines.slice(0, 4)) {
    page.drawText(line, { x, y: cursorY, size: 10.5, font, color: NAVY });
    cursorY -= 14;
  }
  return cursorY - 4;
}

export async function generatePreinscriptionSheetPdf(
  data: PreinscriptionSheetData,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let y = PAGE_HEIGHT - MARGIN;

  try {
    const logoBytes = await readFile(
      path.join(process.cwd(), "public", "ltprotectformationlogo-transparent.png"),
    );
    const logo = await pdf.embedPng(logoBytes);
    const logoHeight = 52;
    const logoWidth = (logo.width / logo.height) * logoHeight;
    page.drawImage(logo, {
      x: MARGIN,
      y: y - logoHeight,
      width: logoWidth,
      height: logoHeight,
    });
  } catch {
    page.drawText(SITE.name, { x: MARGIN, y: y - 20, size: 14, font: fontBold, color: NAVY });
  }

  const headerX = MARGIN + 130;
  page.drawText(SITE.name, { x: headerX, y: y - 14, size: 13, font: fontBold, color: NAVY });
  page.drawText(SITE.address.full, {
    x: headerX,
    y: y - 30,
    size: 9,
    font,
    color: SLATE,
    maxWidth: CONTENT_WIDTH - 130,
    lineHeight: 11,
  });
  page.drawText(`${SITE.phone} · ${SITE.email}`, {
    x: headerX,
    y: y - 54,
    size: 9,
    font,
    color: SLATE,
  });

  y -= 88;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 1,
    color: ACCENT,
  });

  y -= 28;
  page.drawText("Fiche de pré-inscription stagiaire", {
    x: MARGIN,
    y,
    size: 18,
    font: fontBold,
    color: NAVY,
  });
  page.drawText(`Réf. ${data.reference}`, {
    x: PAGE_WIDTH - MARGIN - 80,
    y: y + 2,
    size: 9,
    font,
    color: SLATE,
  });

  y -= 24;
  page.drawText("Informations du stagiaire", {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: NAVY,
  });

  y -= 18;
  const colWidth = CONTENT_WIDTH / 2 - 8;
  const leftX = MARGIN;
  const rightX = MARGIN + colWidth + 16;

  y = Math.min(
    drawLabelValue(page, fontBold, font, leftX, y, "Nom", data.lastName, colWidth),
    drawLabelValue(page, fontBold, font, rightX, y, "Prénom", data.firstName, colWidth),
  );
  y = Math.min(
    drawLabelValue(page, fontBold, font, leftX, y, "Téléphone", data.phone, colWidth),
    drawLabelValue(page, fontBold, font, rightX, y, "Email", data.email, colWidth),
  );
  y = drawLabelValue(page, fontBold, font, leftX, y, "Formation choisie", data.formationTitle, CONTENT_WIDTH);
  y = drawLabelValue(page, fontBold, font, leftX, y, "Session choisie", data.sessionLabel, CONTENT_WIDTH);
  y = drawLabelValue(page, fontBold, font, leftX, y, "Date de demande", data.submittedAtLabel, colWidth);

  y -= 12;
  page.drawText("Informations administratives et formation", {
    x: MARGIN,
    y,
    size: 11,
    font: fontBold,
    color: NAVY,
  });

  y -= 18;
  y = Math.min(
    drawLabelValue(page, fontBold, font, leftX, y, "Statut", data.statusLabel, colWidth),
    drawLabelValue(page, fontBold, font, rightX, y, "Places réservées", data.reservedSeatsLabel, colWidth),
  );

  if (data.cpfFinancing) {
    y = drawLabelValue(page, fontBold, font, leftX, y, "Financement CPF", data.cpfFinancing, CONTENT_WIDTH);
  }

  if (data.sessionDetails) {
    y = drawLabelValue(page, fontBold, font, leftX, y, "Détails de la session", data.sessionDetails, CONTENT_WIDTH);
  }

  y = drawLabelValue(
    page,
    fontBold,
    font,
    leftX,
    y,
    "Observations",
    data.observations ?? "—",
    CONTENT_WIDTH,
  );

  y -= 16;
  page.drawText("Signatures", { x: MARGIN, y, size: 11, font: fontBold, color: NAVY });
  y -= 18;

  const boxHeight = 72;
  const signatureWidth = CONTENT_WIDTH / 2 - 8;

  page.drawRectangle({
    x: leftX,
    y: y - boxHeight,
    width: signatureWidth,
    height: boxHeight,
    borderColor: BORDER,
    borderWidth: 1,
  });
  page.drawText("Signature du stagiaire", {
    x: leftX + 10,
    y: y - 16,
    size: 9,
    font: fontBold,
    color: SLATE,
  });
  page.drawText("Date : ____ / ____ / ______", {
    x: leftX + 10,
    y: y - boxHeight + 12,
    size: 9,
    font,
    color: SLATE,
  });

  page.drawRectangle({
    x: rightX,
    y: y - boxHeight,
    width: signatureWidth,
    height: boxHeight,
    borderColor: BORDER,
    borderWidth: 1,
  });
  page.drawText("Signature de l'administration", {
    x: rightX + 10,
    y: y - 16,
    size: 9,
    font: fontBold,
    color: SLATE,
  });
  page.drawText("Date : ____ / ____ / ______", {
    x: rightX + 10,
    y: y - boxHeight + 12,
    size: 9,
    font,
    color: SLATE,
  });

  y -= boxHeight + 20;
  page.drawLine({
    start: { x: MARGIN, y },
    end: { x: PAGE_WIDTH - MARGIN, y },
    thickness: 0.5,
    color: BORDER,
  });
  page.drawText(
    "Document généré par LT Protect Formation — à conserver pour l'inscription sur place.",
    {
      x: MARGIN,
      y: y - 14,
      size: 8,
      font,
      color: SLATE,
    },
  );

  return pdf.save();
}

export function buildPreinscriptionSheetFilename(data: PreinscriptionSheetData): string {
  const safeName = data.lastName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9-]+/g, "-")
    .toLowerCase();
  return `fiche-preinscription-${safeName || "stagiaire"}.pdf`;
}
