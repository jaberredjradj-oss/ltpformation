import Link from "next/link";
import type { LegalBlock, LegalInline, LegalSection, LegalSubsection } from "@/lib/legal/types";

function renderInline(part: LegalInline, index: number) {
  if (part.href) {
    const className = part.bold
      ? "font-semibold text-blue-600 hover:text-blue-700"
      : "font-semibold text-blue-600 hover:text-blue-700";
    const isInternal = part.href.startsWith("/");
    const isMailto = part.href.startsWith("mailto:");

    if (isInternal) {
      return (
        <Link key={index} href={part.href} className={className}>
          {part.text}
        </Link>
      );
    }

    return (
      <a
        key={index}
        href={part.href}
        target={isMailto ? undefined : "_blank"}
        rel={isMailto ? undefined : "noopener noreferrer"}
        className={className}
      >
        {part.text}
      </a>
    );
  }

  if (part.bold) {
    return (
      <strong key={index} className="font-semibold text-navy-950">
        {part.text}
      </strong>
    );
  }

  return <span key={index}>{part.text}</span>;
}

function renderBlock(block: LegalBlock, index: number) {
  if (block.type === "paragraph") {
    return (
      <p key={index} className="text-sm leading-relaxed text-body-strong">
        {block.content.map(renderInline)}
      </p>
    );
  }

  return (
    <ul key={index} className="ml-6 list-disc space-y-1 text-sm leading-relaxed text-body-strong">
      {block.items.map((item, itemIndex) => (
        <li key={itemIndex}>{item.map(renderInline)}</li>
      ))}
    </ul>
  );
}

function renderBlocks(blocks: LegalBlock[]) {
  return blocks.map(renderBlock);
}

function renderSubsection(subsection: LegalSubsection) {
  return (
    <div key={subsection.title} className="space-y-3">
      <h3 className="text-base font-semibold tracking-[-0.012em] text-navy-950">
        {subsection.title}
      </h3>
      <div className="space-y-3">{renderBlocks(subsection.blocks)}</div>
    </div>
  );
}

function renderSection(section: LegalSection) {
  return (
    <article key={section.title} className="refined-card space-y-5 p-6 md:p-8">
      <h2 className="text-lg font-semibold tracking-[-0.018em] text-navy-950">{section.title}</h2>
      {section.blocks && section.blocks.length > 0 && (
        <div className="space-y-3">{renderBlocks(section.blocks)}</div>
      )}
      {section.subsections?.map(renderSubsection)}
      {section.afterSubsections && section.afterSubsections.length > 0 && (
        <div className="space-y-3">{renderBlocks(section.afterSubsections)}</div>
      )}
    </article>
  );
}

interface LegalDocumentContentProps {
  sections: LegalSection[];
}

export function LegalDocumentContent({ sections }: LegalDocumentContentProps) {
  return <div className="space-y-6">{sections.map(renderSection)}</div>;
}
