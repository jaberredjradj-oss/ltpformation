const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { cleanText, splitSections } = require("./parse-ltp-pdf.cjs");

async function main() {
  const parser = new PDFParse({
    data: fs.readFileSync("c:/Users/W10/Downloads/ssiap1-initial.pdf"),
  });
  const text = cleanText((await parser.getText()).text);
  await parser.destroy();
  const sections = splitSections(text);
  console.log("EVAL:\n", sections["Évaluation"]);
  console.log("\nSUIVI:\n", sections["Suivi et évaluation"]);
  console.log("MODAL:\n", sections["Modalités d'inscription et positionnement"]);
  console.log("\nCONTACT:\n", sections["Contact et inscriptions"]);
}

main();
