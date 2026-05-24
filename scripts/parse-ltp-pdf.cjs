const fs = require("fs");
const { PDFParse } = require("pdf-parse");

const SECTION_MARKERS = [
  "Public concerné",
  "Pré-requis",
  "Nombre de participants et lieu de la formation",
  "Présentation de la formation",
  "Objectifs de la formation",
  "Contenu de la formation",
  "Modalités d'inscription et positionnement",
  "Contact et inscriptions",
  "Lieu de formation",
  "Délai d'accès",
  "Évaluation",
  "Équipe pédagogique",
  "Moyens pédagogiques et techniques",
  "Suivi et évaluation",
  "Débouchés et évolution",
  "Accessibilité aux personnes en situation de handicap",
  "Tarif",
];

function cleanText(text) {
  return text
    .replace(/\r/g, "")
    .replace(/LT PROTECT FORMATION – SIRET[\s\S]*?Agrément n° 078-0020\n/g, "")
    .replace(/-- \d+ of \d+ --/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function parseAudience(content) {
  if (!content) return [];
  const bullets = parseBullets(content);
  if (bullets.length > 1) return bullets;
  return [paragraph(content)];
}

function extractTitle(text) {
  const match = text.match(
    /Agrément n° 078-0020\n([\s\S]*?)\nDurée\s*:/,
  );
  return match ? match[1].replace(/\n/g, " ").trim() : "";
}

function extractDuration(text) {
  const match = text.match(/Durée\s*:\s*([\d.,]+)\s*heures?\s*(?:\(([\d.,]+)\s*jours?\))?/i);
  if (!match) return { hours: 0, label: "—" };

  const hours = parseFloat(match[1].replace(",", "."));
  const days = match[2] ? parseFloat(match[2].replace(",", ".")) : null;
  const label =
    days !== null
      ? `${hours.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} heures (${days.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} jours)`
      : `${hours.toLocaleString("fr-FR", { maximumFractionDigits: 2 })} heures`;

  return { hours, label };
}

function extractPrice(text) {
  const match = text.match(/Tarif\s*\n\s*([\d\s.,]+)\s*€\s*(TTC|HT)?(?:\s*par participant)?/i);
  if (!match) return { amount: 0, label: "—", shortLabel: "—" };

  const amount = parseFloat(match[1].replace(/\s/g, "").replace(",", "."));
  const tax = match[2] ? ` ${match[2]}` : "";
  const shortLabel = `${amount.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €${tax}`.trim();

  return { amount, label: `${shortLabel} par participant`, shortLabel };
}

function detectCpfEligible(text, sections) {
  const sources = [
    text,
    sections["Modalités d'inscription et positionnement"],
    sections["Contact et inscriptions"],
    sections["Présentation de la formation"],
  ].filter(Boolean);

  const haystack = sources.join("\n");
  return /cpf|compte personnel de formation|mon compte formation|éligible\s+(?:au\s+)?cpf|eligible\s+(?:au\s+)?cpf/i.test(
    haystack,
  );
}

function extractCpfNote(text, sections) {
  const haystack = [
    sections["Modalités d'inscription et positionnement"],
    sections["Contact et inscriptions"],
    text,
  ]
    .filter(Boolean)
    .join("\n");

  const match = haystack.match(
    /[^\n.]*(?:cpf|compte personnel de formation|mon compte formation)[^\n.]*/i,
  );
  return match ? paragraph(match[0]) : undefined;
}

function splitSections(text) {
  const sections = {};
  const orderedMarkers = [...SECTION_MARKERS].sort((a, b) => b.length - a.length);
  const pattern = new RegExp(
    `(?:^|\\n)(${orderedMarkers.map((marker) => marker.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})(?=\\n|$)`,
    "g",
  );

  const matches = [...text.matchAll(pattern)];
  if (matches.length === 0) return sections;

  for (let index = 0; index < matches.length; index += 1) {
    const heading = matches[index][1];
    const start = matches[index].index + matches[index][0].length;
    const end = index + 1 < matches.length ? matches[index + 1].index : text.length;
    const body = text.slice(start, end).trim();
    if (SECTION_MARKERS.includes(heading)) {
      sections[heading] = body;
    }
  }

  return sections;
}

function parseBullets(content) {
  if (!content) return [];

  const normalized = content.replace(/•/g, "\n• ");
  const lines = normalized
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const items = [];
  let current = "";

  for (const line of lines) {
    if (/^[•\-–]\s/.test(line) || /^\d+\.\s/.test(line)) {
      if (current) items.push(current.trim());
      current = line.replace(/^[•\-–]\s*/, "").replace(/^\d+\.\s*/, "");
    } else if (current) {
      current += ` ${line}`;
    } else {
      items.push(line);
      current = "";
    }
  }

  if (current) items.push(current.trim());

  return items.length > 0 ? items : content ? [paragraph(content)] : [];
}

function parseModules(content) {
  if (!content) return { totalHours: undefined, modules: [] };

  const lines = content
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !/^MODULE/i.test(line) && !/^DURÉE/i.test(line));

  const modules = [];

  for (const line of lines) {
    const match = line.match(/^(.+?)\s+(\d+(?:[.,]\d+)?)\s*heures?$/i);
    if (match) {
      modules.push({
        title: match[1].trim(),
        hours: parseFloat(match[2].replace(",", ".")),
        content: [],
      });
      continue;
    }

    const inlineMatch = line.match(/^(.+?)\s*:\s*(\d+(?:[.,]\d+)?)\s*heures?\s*$/i);
    if (inlineMatch) {
      modules.push({
        title: inlineMatch[1].trim(),
        hours: parseFloat(inlineMatch[2].replace(",", ".")),
        content: [],
      });
    }
  }

  const totalHours = modules.reduce((sum, module) => sum + (module.hours ?? 0), 0);

  return {
    totalHours: modules.length > 0 ? totalHours : undefined,
    modules,
  };
}

function paragraph(content) {
  return content.replace(/\s+/g, " ").trim();
}

async function parsePdf(filePath) {
  const parser = new PDFParse({ data: fs.readFileSync(filePath) });
  const result = await parser.getText();
  await parser.destroy();

  const text = cleanText(result.text);
  const sections = splitSections(text);
  const duration = extractDuration(text);
  const price = extractPrice(text);
  const programme = parseModules(sections["Contenu de la formation"]);

  const registrationItems = parseBullets(sections["Modalités d'inscription et positionnement"]);
  const registration = [];

  if (sections["Nombre de participants et lieu de la formation"]) {
    registration.push(paragraph(sections["Nombre de participants et lieu de la formation"]));
  }

  registration.push(...registrationItems);

  if (sections["Contact et inscriptions"]) {
    registration.push(paragraph(sections["Contact et inscriptions"]));
  }

  const lieuMatch = text.match(/Lieu de formation\s*:\s*([^\n]+)/);
  if (lieuMatch) {
    registration.push(`Lieu de formation : ${paragraph(lieuMatch[1])}`);
  }

  if (sections["Délai d'accès"]) {
    registration.push(`Délai d'accès : ${paragraph(sections["Délai d'accès"])}`);
  }

  const evaluationContent = sections["Évaluation"] ?? "";
  const evaluation = evaluationContent ? parseBullets(evaluationContent) : [];
  const cpfEligible = detectCpfEligible(text, sections);
  const cpfNote = cpfEligible ? extractCpfNote(text, sections) : undefined;

  return {
    title: extractTitle(text),
    durationHours: duration.hours,
    durationLabel: duration.label,
    price: {
      amount: price.amount,
      currency: "EUR",
      label: price.label,
      shortLabel: price.shortLabel,
    },
    cpfEligible,
    cpfNote,
    publicConcerned: parseAudience(sections["Public concerné"]),
    prerequisites: parseBullets(sections["Pré-requis"]),
    presentation: paragraph(sections["Présentation de la formation"] ?? ""),
    objectives: parseBullets(sections["Objectifs de la formation"]),
    programme,
    registration,
    evaluation,
    pedagogicalTeam: sections["Équipe pédagogique"]
      ? [paragraph(sections["Équipe pédagogique"])]
      : [],
    pedagogicalMeans: parseBullets(sections["Moyens pédagogiques et techniques"]),
    followUp: parseBullets(sections["Suivi et évaluation"]),
    careerOutcomes: sections["Débouchés et évolution"]
      ? [paragraph(sections["Débouchés et évolution"])]
      : [],
    accessibility: paragraph(sections["Accessibilité aux personnes en situation de handicap"] ?? ""),
  };
}

module.exports = {
  parsePdf,
  cleanText,
  splitSections,
};
