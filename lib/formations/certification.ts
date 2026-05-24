export function getCertificationCodeUrl(code: string): string | undefined {
  if (/^RS\d+$/i.test(code)) {
    return `https://www.francecompetences.fr/recherche/rs/${code.slice(2)}/`;
  }

  if (/^RNCP\d+$/i.test(code)) {
    return `https://www.francecompetences.fr/recherche/rncp/${code.slice(4)}/`;
  }

  return undefined;
}

export function getCertificationCodeLabel(code: string): string {
  if (/^RS\d+$/i.test(code)) {
    return `Répertoire spécifique ${code.toUpperCase()}`;
  }

  if (/^RNCP\d+$/i.test(code)) {
    return `RNCP ${code.slice(4)}`;
  }

  return code;
}
