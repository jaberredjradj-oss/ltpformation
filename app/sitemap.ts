import type { MetadataRoute } from "next";
import { getBlogPosts, isBlogPublished } from "@/lib/blog/posts";
import { loadFormations } from "@/lib/repositories/formations";
import { getSiteUrl } from "@/lib/site-url";

/** Pages éditoriales fixes, avec leur priorité relative. */
const STATIC_ROUTES: Array<{ path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }> = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/formations", priority: 0.9, changeFrequency: "weekly" },
  { path: "/planning", priority: 0.9, changeFrequency: "daily" },
  { path: "/blog", priority: 0.7, changeFrequency: "weekly" },
  { path: "/qui-sommes-nous", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "monthly" },
  { path: "/devis", priority: 0.6, changeFrequency: "monthly" },
  { path: "/preinscription", priority: 0.6, changeFrequency: "monthly" },
  { path: "/mentions-legales", priority: 0.2, changeFrequency: "yearly" },
  { path: "/cgv", priority: 0.2, changeFrequency: "yearly" },
  { path: "/politique-de-confidentialite", priority: 0.2, changeFrequency: "yearly" },
];

/**
 * Plan du site. Les formations et les articles sont énumérés dynamiquement :
 * toute fiche ajoutée depuis l'admin y apparaît sans intervention.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl().replace(/\/$/, "");
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES
    // Le blog n'entre au plan du site qu'une fois le premier article publié.
    .filter((route) => route.path !== "/blog" || isBlogPublished())
    .map((route) => ({
      url: `${baseUrl}${route.path}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
    }));

  // Une base indisponible ne doit jamais faire échouer le sitemap.
  let formationEntries: MetadataRoute.Sitemap = [];
  try {
    const formations = await loadFormations();
    formationEntries = formations.map((formation) => ({
      url: `${baseUrl}/formations/${formation.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch (error) {
    console.error("[sitemap] formations indisponibles", error);
  }

  const blogEntries: MetadataRoute.Sitemap = getBlogPosts().map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt ?? post.publishedAt),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticEntries, ...formationEntries, ...blogEntries];
}
