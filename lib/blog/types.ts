/**
 * Article de blog.
 *
 * Chaque champ correspond à une exigence de la structure technique demandée :
 * URL en slug, title / meta description / H1 uniques, sous-parties en H2-H3,
 * image principale avec alt, lien interne vers la formation concernée,
 * date de publication (signal de fraîcheur) et auteur (signal E-E-A-T).
 */
export interface BlogPost {
  /** Segment d'URL : minuscules, mots séparés par des tirets. */
  slug: string;
  /** Balise <title>, unique par article. */
  seoTitle: string;
  /** Meta description, unique par article. */
  seoDescription: string;
  /** H1 de l'article, unique et distinct du titre de la carte. */
  h1: string;
  /** Titre court affiché dans la liste des articles. */
  listTitle: string;
  /** Résumé affiché dans la liste et en chapeau de l'article. */
  excerpt: string;
  /** Date de publication au format ISO (AAAA-MM-JJ). */
  publishedAt: string;
  /** Date de dernière mise à jour, si l'article a été révisé. */
  updatedAt?: string;
  /** Auteur affiché (signal E-E-A-T). */
  author: string;
  /** Image principale : chemin public et texte alternatif optimisé. */
  image?: { src: string; alt: string };
  /** Slug de la formation à lier depuis l'article (maillage interne). */
  relatedFormationSlug?: string;
  /** Corps de l'article, structuré en sections H2 et sous-sections H3. */
  sections: BlogSection[];
}

export interface BlogSection {
  /** Titre de section — rendu en <h2>. */
  heading: string;
  /** Paragraphes de la section. */
  paragraphs?: string[];
  /** Liste à puces éventuelle. */
  bullets?: string[];
  /** Sous-sections — rendues en <h3>. */
  subsections?: Array<{ heading: string; paragraphs: string[] }>;
}
