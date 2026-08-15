import Link from "next/link";
import RenderTiptap from "./RenderTiptap";
import type { TiptapDoc } from "@/lib/types";

/**
 * The post layout, shared by the public page and the studio preview so what
 * you preview is exactly what readers get.
 */
export default function PostArticle({
  title,
  date,
  tags,
  coverImage,
  doc,
  backHref = "/blog",
  backLabel = "Back to blog",
  children,
}: {
  title: string;
  date: string;
  tags?: string[];
  coverImage?: string | null;
  doc: TiptapDoc;
  backHref?: string;
  backLabel?: string;
  children?: React.ReactNode;
}) {
  return (
    <article className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
      <header className="pt-28 pb-8">
        <Link
          href={backHref}
          className="text-xs text-foreground/40 hover:text-accent transition-colors mb-6 inline-block"
        >
          {backLabel}
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
          {title}
        </h1>
        <div className="flex items-center gap-3 text-xs text-foreground/40">
          <span>{date}</span>
          {tags && tags.length > 0 && (
            <>
              <span className="text-border">|</span>
              <div className="flex gap-2">
                {tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
            </>
          )}
        </div>
      </header>

      {coverImage && (
        <div className="mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverImage} alt={title} className="rounded-lg max-w-full" />
        </div>
      )}

      <div className="blog-prose">
        <RenderTiptap doc={doc} />
      </div>

      {children}
    </article>
  );
}
