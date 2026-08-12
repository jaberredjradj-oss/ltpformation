import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { formatBlogDate, getBlogPost, getBlogSlugs } from "@/lib/blog/posts";
import { getFormation } from "@/lib/formations/catalog";
import { getSiteUrl } from "@/lib/site-url";
import { Container } from "@/components/ui/Container";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Article introuvable" };
  }

  return {
    title: { absolute: post.seoTitle },
    description: post.seoDescription,
    alternates: {
      canonical: `${getSiteUrl().replace(/\/$/, "")}/blog/${post.slug}`,
    },
    openGraph: {
      type: "article",
      title: post.seoTitle,
      description: post.seoDescription,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt ?? post.publishedAt,
      authors: [post.author],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    notFound();
  }

  const relatedFormation = post.relatedFormationSlug
    ? getFormation(post.relatedFormationSlug)
    : undefined;

  // Données structurées : aide Google et les moteurs conversationnels à citer
  // l'article comme source (objectif « longue traîne » du brief).
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.h1,
    description: post.seoDescription,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "LT Protect Formation" },
    mainEntityOfPage: `${getSiteUrl().replace(/\/$/, "")}/blog/${post.slug}`,
  };

  return (
    <article className="section-wash-blend py-12 md:py-16">
      <Container>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />

        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
        >
          ← Retour au blog
        </Link>

        <header className="mt-6 max-w-3xl heading-accent-glow">
          <h1 className="text-[1.8rem] font-semibold leading-[1.1] tracking-[-0.028em] text-navy-950 sm:text-[2.35rem]">
            {post.h1}
          </h1>
          <p className="mt-4 text-sm text-lead-strong">
            Publié le{" "}
            <time dateTime={post.publishedAt}>{formatBlogDate(post.publishedAt)}</time>
            {post.updatedAt && (
              <>
                {" · Mis à jour le "}
                <time dateTime={post.updatedAt}>{formatBlogDate(post.updatedAt)}</time>
              </>
            )}
            {" · par "}
            <span className="font-semibold text-navy-950">{post.author}</span>
          </p>
          <p className="editorial-lead mt-5 text-pretty">{post.excerpt}</p>
        </header>

        {post.image && (
          <div className="relative mt-8 aspect-[16/9] w-full overflow-hidden rounded-xl">
            <Image
              src={post.image.src}
              alt={post.image.alt}
              fill
              sizes="(max-width: 1024px) 100vw, 900px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mt-10 max-w-3xl space-y-10">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-semibold leading-snug text-navy-950 sm:text-2xl">
                {section.heading}
              </h2>

              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph} className="mt-4 leading-relaxed text-body-strong">
                  {paragraph}
                </p>
              ))}

              {section.bullets && (
                <ul className="mt-4 list-disc space-y-2 pl-5 text-body-strong">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              )}

              {section.subsections?.map((subsection) => (
                <div key={subsection.heading} className="mt-6">
                  <h3 className="text-lg font-semibold text-navy-950">{subsection.heading}</h3>
                  {subsection.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="mt-3 leading-relaxed text-body-strong">
                      {paragraph}
                    </p>
                  ))}
                </div>
              ))}
            </section>
          ))}
        </div>

        {relatedFormation && (
          <aside className="refined-card mt-12 max-w-3xl p-6">
            <p className="section-eyebrow">Formation associée</p>
            <h2 className="mt-2 text-lg font-semibold text-navy-950">
              {relatedFormation.shortTitle ?? relatedFormation.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-body-strong">
              {relatedFormation.summary}
            </p>
            <Link
              href={`/formations/${relatedFormation.slug}`}
              className="mt-4 inline-flex text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Découvrir la formation →
            </Link>
          </aside>
        )}
      </Container>
    </article>
  );
}
