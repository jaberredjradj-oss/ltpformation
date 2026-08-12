import type { BlogPost } from "@/lib/blog/types";

/**
 * Registre des articles publiés.
 *
 * Pour publier un article : ajouter un objet ci-dessous. La page de liste, la
 * page article, le plan du site et le lien dans le pied de page se mettent à
 * jour automatiquement — aucune autre modification n'est nécessaire.
 *
 * Le blog reste invisible tant que ce tableau est vide (aucun lien affiché,
 * absent du sitemap), conformément à la demande : mise en ligne une fois le
 * premier article prêt.
 *
 * Gabarit :
 *
 * {
 *   slug: "comment-financer-sa-formation-ssiap-avec-le-cpf",
 *   seoTitle: "Financer sa formation SSIAP avec le CPF en 2026 | LT Protect Formation",
 *   seoDescription: "Toutes les étapes pour financer votre formation SSIAP …",
 *   h1: "Comment financer sa formation SSIAP avec le CPF ?",
 *   listTitle: "Financer sa formation SSIAP avec le CPF",
 *   excerpt: "Les démarches concrètes, les montants et les pièges à éviter.",
 *   publishedAt: "2026-08-12",
 *   author: "LT Protect Formation",
 *   image: { src: "/images/blog/cpf.jpg", alt: "Formation SSIAP financée par le CPF …" },
 *   relatedFormationSlug: "ssiap-1-initial",
 *   sections: [
 *     {
 *       heading: "Qu'est-ce que le CPF ?",
 *       paragraphs: ["…"],
 *       subsections: [{ heading: "Qui y a droit ?", paragraphs: ["…"] }],
 *     },
 *   ],
 * }
 */
export const BLOG_POSTS: BlogPost[] = [];

/** Articles publiés, du plus récent au plus ancien. */
export function getBlogPosts(): BlogPost[] {
  return [...BLOG_POSTS].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
  );
}

export function getBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

export function getBlogSlugs(): string[] {
  return BLOG_POSTS.map((post) => post.slug);
}

/** Le blog n'est exposé (menu, sitemap) qu'à partir du premier article. */
export function isBlogPublished(): boolean {
  return BLOG_POSTS.length > 0;
}

/** Date lisible en français, pour l'affichage et l'attribut <time>. */
export function formatBlogDate(iso: string): string {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}
