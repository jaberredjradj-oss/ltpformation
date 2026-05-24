const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { cleanText } = require("./parse-ltp-pdf.cjs");

async function main() {
  const parser = new PDFParse({
    data: fs.readFileSync("c:/Users/W10/Downloads/ssiap1-initial.pdf"),
  });
  const text = cleanText((await parser.getText()).text);
  await parser.destroy();
  console.log(text);
}

main();
