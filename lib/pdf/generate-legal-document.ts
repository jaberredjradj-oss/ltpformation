import { PDFDocument, StandardFonts, rgb, type PDFPage, type PDFFont } from "pdf-lib";
import { SITE } from "@/lib/constants";
import type { LegalBlock, LegalDocumentDefinition, LegalInline, LegalSection } from "@/lib/legal/types";

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;
const MARGIN = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;
const LINE_HEIGHT = 14;
const BODY_SIZE = 10.5;
const H2_SIZE = 13;
const H3_SIZE = 11.5;

const NAVY = rgb(0.04, 0.12, 0.22);
const SLATE = rgb(0.35, 0.39, 0.45);
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

function inlineToPlainText(parts: LegalInline[]): string {
  return parts.map((part) => part.text).join("");
}

class LegalPdfWriter {
  private pdf: PDFDocument;
  private page: PDFPage;
  private font: PDFFont;
  private fontBold: PDFFont;
  private y = PAGE_HEIGHT - MARGIN;

  constructor(pdf: PDFDocument, page: PDFPage, font: PDFFont, fontBold: PDFFont) {
    this.pdf = pdf;
    this.page = page;
    this.font = font;
    this.fontBold = fontBold;
  }

  private ensureSpace(minHeight: number) {
    if (this.y - minHeight >= MARGIN + 24) return;

    this.page = this.pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    this.y = PAGE_HEIGHT - MARGIN;
  }

  private drawLines(
    lines: string[],
    size: number,
    font: PDFFont,
    color = NAVY,
    indent = 0,
  ) {
    for (const line of lines) {
      this.ensureSpace(LINE_HEIGHT + 4);
      this.page.drawText(line, {
        x: MARGIN + indent,
        y: this.y,
        size,
        font,
        color,
        maxWidth: CONTENT_WIDTH - indent,
      });
      this.y -= LINE_HEIGHT;
    }
  }

  writeHeader(title: string) {
    this.page.drawText(SITE.name, {
      x: MARGIN,
      y: this.y,
      size: 9,
      font: this.font,
      color: SLATE,
    });
    this.y -= 18;

    this.drawLines([title], 18, this.fontBold, NAVY);
    this.y -= 8;
    this.page.drawLine({
      start: { x: MARGIN, y: this.y },
      end: { x: PAGE_WIDTH - MARGIN, y: this.y },
      thickness: 1,
      color: ACCENT,
    });
    this.y -= 20;
  }

  writeHeading(title: string, level: 2 | 3) {
    this.y -= level === 2 ? 8 : 4;
    this.ensureSpace(LINE_HEIGHT * 2);
    const size = level === 2 ? H2_SIZE : H3_SIZE;
    this.drawLines([title], size, this.fontBold);
    this.y -= 4;
  }

  writeBlock(block: LegalBlock) {
    if (block.type === "paragraph") {
      const text = inlineToPlainText(block.content);
      const lines = wrapText(text, 92);
      this.drawLines(lines, BODY_SIZE, this.font);
      this.y -= 4;
      return;
    }

    for (const item of block.items) {
      const text = inlineToPlainText(item);
      const lines = wrapText(text, 88);
      this.ensureSpace(LINE_HEIGHT * lines.length + 4);
      this.page.drawText("•", {
        x: MARGIN + 4,
        y: this.y,
        size: BODY_SIZE,
        font: this.font,
        color: NAVY,
      });
      this.drawLines(lines, BODY_SIZE, this.font, NAVY, 16);
      this.y -= 2;
    }
    this.y -= 2;
  }

  writeSection(section: LegalSection) {
    this.writeHeading(section.title, 2);
    section.blocks?.forEach((block) => this.writeBlock(block));
    section.subsections?.forEach((subsection) => {
      this.writeHeading(subsection.title, 3);
      subsection.blocks.forEach((block) => this.writeBlock(block));
    });
    section.afterSubsections?.forEach((block) => this.writeBlock(block));
  }

  writeFooter() {
    const pages = this.pdf.getPages();
    for (const currentPage of pages) {
      currentPage.drawLine({
        start: { x: MARGIN, y: MARGIN + 12 },
        end: { x: PAGE_WIDTH - MARGIN, y: MARGIN + 12 },
        thickness: 0.5,
        color: SLATE,
      });
      currentPage.drawText(`${SITE.name} — ${SITE.email}`, {
        x: MARGIN,
        y: MARGIN,
        size: 8,
        font: this.font,
        color: SLATE,
      });
    }
  }
}

export async function generateLegalDocumentPdf(
  document: LegalDocumentDefinition,
): Promise<Uint8Array> {
  const pdf = await PDFDocument.create();
  const page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  const font = await pdf.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdf.embedFont(StandardFonts.HelveticaBold);
  const writer = new LegalPdfWriter(pdf, page, font, fontBold);

  writer.writeHeader(document.title);

  for (const section of document.sections) {
    writer.writeSection(section);
  }

  writer.writeFooter();

  pdf.setTitle(document.title);
  pdf.setAuthor(SITE.name);
  pdf.setSubject(document.seoDescription);
  pdf.setCreator(SITE.name);

  return pdf.save();
}
