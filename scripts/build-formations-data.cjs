const fs = require("fs");
const path = require("path");
const { parsePdf } = require("./parse-ltp-pdf.cjs");

const ROOT = path.join(__dirname, "..");
const config = JSON.parse(fs.readFileSync(path.join(__dirname, "pdf-sources.json"), "utf8"));
const metadata = JSON.parse(fs.readFileSync(path.join(__dirname, "formation-metadata.json"), "utf8"));

const OUTPUT_DIR = path.join(ROOT, "lib", "formations", "data");
const PDF_OUTPUT_DIR = path.join(ROOT, "public", "pdfs", "formations");

function escapeString(value) {
  return JSON.stringify(value);
}

function formatModule(module) {
  const hours = module.hours !== undefined ? `\n      hours: ${module.hours},` : "";
  const content =
    module.content.length > 0
      ? `\n      content: [\n${module.content.map((item) => `        ${escapeString(item)},`).join("\n")}\n      ],`
      : "\n      content: [],";

  return `    {\n      title: ${escapeString(module.title)},${hours}${content}\n    }`;
}

function buildFormationFile(slug, meta, parsed) {
  const summary =
    parsed.presentation.length > 260
      ? `${parsed.presentation.slice(0, 257).trim()}…`
      : parsed.presentation;
  const cpfEligible = meta.cpfEligible !== undefined ? meta.cpfEligible : parsed.cpfEligible;
  const cpfNote = cpfEligible && parsed.cpfNote ? parsed.cpfNote : undefined;
  const certificationCode = meta.certificationCode
    ? `\n  certificationCode: ${escapeString(meta.certificationCode)},`
    : "";

  return `import type { Formation } from "@/lib/formations/types";

export const formation: Formation = {
  slug: ${escapeString(slug)},
  title: ${escapeString(parsed.title || meta.title)},
  shortTitle: ${escapeString(meta.shortTitle)},
  category: ${escapeString(meta.category)},
  categoryLabel: ${escapeString(meta.categoryLabel)},
  type: ${escapeString(meta.type)},
  typeLabel: ${escapeString(meta.typeLabel)},
  level: ${meta.level === null ? "null" : escapeString(meta.level)},
  durationHours: ${parsed.durationHours},
  durationLabel: ${escapeString(parsed.durationLabel)},
  price: {
    amount: ${parsed.price.amount},
    currency: "EUR",
    label: ${escapeString(parsed.price.label)},
    shortLabel: ${escapeString(parsed.price.shortLabel)},
  },
  cpfEligible: ${cpfEligible},${cpfNote ? `\n  cpfNote: ${escapeString(parsed.cpfNote)},` : ""}${certificationCode}
  certifications: ["Qualiopi"],
  summary: ${escapeString(summary)},
  imageKey: ${escapeString(meta.imageKey)},
  pdfFilename: ${escapeString(`${slug}.pdf`)},
  pdfUrl: ${escapeString(`/pdfs/formations/${slug}.pdf`)},
  pdfAvailable: true,
  contentStatus: "published",
  publicConcerned: [
${parsed.publicConcerned.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  prerequisites: [
${parsed.prerequisites.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  presentation: ${escapeString(parsed.presentation)},
  objectives: [
${parsed.objectives.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  programme: {
    ${parsed.durationHours ? `totalHours: ${parsed.durationHours},` : parsed.programme.totalHours !== undefined ? `totalHours: ${parsed.programme.totalHours},` : ""}
    modules: [
${parsed.programme.modules.map(formatModule).join(",\n")}
    ],
  },
  registration: [
${parsed.registration.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  evaluation: [
${parsed.evaluation.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  pedagogicalTeam: [
${parsed.pedagogicalTeam.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  pedagogicalMeans: [
${parsed.pedagogicalMeans.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  followUp: [
${parsed.followUp.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  careerOutcomes: [
${parsed.careerOutcomes.map((item) => `    ${escapeString(item)},`).join("\n")}
  ],
  accessibility: ${escapeString(parsed.accessibility)},
};
`;
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });

  const slugs = Object.keys(config.sources);
  const imports = [];

  for (const slug of slugs) {
    const sourcePath = path.join(config.downloadsDir, config.sources[slug]);
    const targetPdf = path.join(PDF_OUTPUT_DIR, `${slug}.pdf`);

    if (!fs.existsSync(sourcePath)) {
      throw new Error(`Missing PDF for ${slug}: ${sourcePath}`);
    }

    fs.copyFileSync(sourcePath, targetPdf);
    const parsed = await parsePdf(sourcePath);
    const meta = metadata[slug];
    const fileContents = buildFormationFile(slug, meta, parsed);
    const filePath = path.join(OUTPUT_DIR, `${slug}.ts`);

    fs.writeFileSync(filePath, fileContents, "utf8");
    imports.push(`import { formation as ${slug.replace(/-/g, "_")} } from "./${slug}";`);
    console.log(`✓ ${slug}`);
  }

  const registry = `${imports.join("\n")}

import type { Formation } from "@/lib/formations/types";

export const FORMATION_DATA: Formation[] = [
${slugs.map((slug) => `  ${slug.replace(/-/g, "_")},`).join("\n")}
];
`;

  fs.writeFileSync(path.join(OUTPUT_DIR, "registry.ts"), registry, "utf8");
  console.log(`\nGenerated ${slugs.length} formations.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
