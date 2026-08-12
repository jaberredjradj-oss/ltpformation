import type { Metadata } from "next";
import Link from "next/link";
import { formatBlogDate, getBlogPosts } from "@/lib/blog/posts";
import { getSiteUrl } from "@/lib/site-url";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: {
    absolute:
      "Blog et actualités : Formation sécurité incendie en Île-de-France | LT Protect Formation",
  },
  description:
    "Conseils, actualités et guides pratiques sur la formation en sécurité incendie, secourisme et sûreté à Voisins-le-Bretonneux (78) et en Île-de-France.",
  alternates: {
    canonical: `${getSiteUrl().replace(/\/$/, "")}/blog`,
  },
};

export default function BlogIndexPage() {
  const posts = getBlogPosts();

  return (
    <section className="section-wash-blend py-14 md:py-20">
      <Container>
        <div className="mx-auto max-w-3xl text-center heading-accent-glow">
          <p className="section-eyebrow">Blog et actualités</p>
          <h1 className="mt-4 text-[2rem] font-semibold leading-[1.08] tracking-[-0.028em] text-navy-950 sm:text-[2.5rem] lg:text-[3rem]">
            Blog et actualités : Formation sécurité incendie en Île-de-France
          </h1>
          <p className="editorial-lead mx-auto mt-5 max-w-2xl text-pretty">
            Conseils pratiques, réponses aux questions fréquentes et actualités de la
            réglementation, par les formateurs de LT Protect Formation à Voisins-le-Bretonneux
            (78).
          </p>
        </div>

        {posts.length === 0 ? (
          <p className="mx-auto mt-12 max-w-xl rounded-lg border border-dashed border-slate-200 bg-white/70 px-6 py-8 text-center text-sm text-lead-strong">
            Les premiers articles arrivent prochainement.
          </p>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article key={post.slug} className="refined-card flex h-full flex-col p-6">
                <time
                  dateTime={post.publishedAt}
                  className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-600/90"
                >
                  {formatBlogDate(post.publishedAt)}
                </time>
                <h2 className="mt-3 text-lg font-semibold leading-snug text-navy-950">
                  <Link href={`/blog/${post.slug}`} className="hover:text-blue-700">
                    {post.listTitle}
                  </Link>
                </h2>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-body-strong">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Lire l&apos;article →
                </Link>
              </article>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
