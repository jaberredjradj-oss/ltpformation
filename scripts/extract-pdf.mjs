import fs from "fs";
import pdf from "pdf-parse/lib/pdf-parse.js";

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/extract-pdf.mjs <path-to-pdf>");
  process.exit(1);
}

const buffer = fs.readFileSync(file);
const data = await pdf(buffer);
console.log(data.text);
