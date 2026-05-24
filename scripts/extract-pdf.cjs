const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/extract-pdf.cjs <path-to-pdf>");
  process.exit(1);
}

async function main() {
  const parser = new PDFParse({ data: fs.readFileSync(file) });
  const result = await parser.getText();
  console.log(result.text);
  await parser.destroy();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
