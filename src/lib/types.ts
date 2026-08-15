/**
 * Shared shapes for the blog. Safe to import from client components --
 * keep this file free of server-only imports.
 */

export interface TiptapNode {
  type?: string;
  attrs?: Record<string, unknown>;
  content?: TiptapNode[];
  marks?: { type: string; attrs?: Record<string, unknown> }[];
  text?: string;
}

export interface TiptapDoc extends TiptapNode {
  type: "doc";
  content?: TiptapNode[];
}

export const EMPTY_DOC: TiptapDoc = { type: "doc", content: [] };

export type PostStatus = "draft" | "published";

/** A row of the `posts` table, camel-cased. */
export interface PostRecord {
  id: string;
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  tags: string[];
  content: TiptapDoc;
  status: PostStatus;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

/** What the public blog listing needs. Matches the old file-based shape. */
export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  description: string;
  coverImage?: string | null;
  tags?: string[];
  /** Last edit time -- drives <lastmod> in the sitemap. */
  updatedAt?: string;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
export function toPostRecord(row: any): PostRecord {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description ?? "",
    coverImage: row.cover_image ?? null,
    tags: row.tags ?? [],
    content: row.content ?? EMPTY_DOC,
    status: row.status,
    publishedAt: row.published_at ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/** Renders a timestamp as the YYYY-MM-DD string the blog UI displays. */
export function formatPostDate(timestamp: string | null): string {
  if (!timestamp) return "";
  const d = new Date(timestamp);
  return isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}
