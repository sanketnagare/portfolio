"use client";

import { useRef } from "react";
import { slugify } from "@/lib/types";

export interface PostMetaFields {
  title: string;
  slug: string;
  description: string;
  tags: string[];
  coverImage: string | null;
}

export default function PostMetaPanel({
  meta,
  onChange,
  onUploadCover,
  uploading,
  slugTouchedRef,
}: {
  meta: PostMetaFields;
  onChange: (next: Partial<PostMetaFields>) => void;
  onUploadCover: (file: File) => Promise<void>;
  uploading: boolean;
  slugTouchedRef: React.MutableRefObject<boolean>;
}) {
  const coverInput = useRef<HTMLInputElement>(null);

  return (
    <div className="pt-8 pb-4">
      <input
        value={meta.title}
        onChange={(e) => {
          const title = e.target.value;
          // Keep the slug in step with the title until it is edited by hand.
          onChange(
            slugTouchedRef.current
              ? { title }
              : { title, slug: slugify(title) }
          );
        }}
        placeholder="Post title"
        className="w-full font-heading text-2xl sm:text-3xl font-bold tracking-tight
                   bg-transparent placeholder:text-foreground/25 focus:outline-none"
      />

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-foreground/40">
            Slug
          </span>
          <input
            value={meta.slug}
            onChange={(e) => {
              slugTouchedRef.current = true;
              onChange({ slug: e.target.value });
            }}
            placeholder="my-post"
            className="mt-1 w-full px-2 py-1.5 text-xs bg-surface border border-border
                       rounded focus:outline-none focus:border-accent transition-colors"
          />
        </label>

        <label className="block">
          <span className="text-[10px] uppercase tracking-wider text-foreground/40">
            Tags (comma separated)
          </span>
          <input
            value={meta.tags.join(", ")}
            onChange={(e) =>
              onChange({
                tags: e.target.value
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean),
              })
            }
            placeholder="Next.js, AI"
            className="mt-1 w-full px-2 py-1.5 text-xs bg-surface border border-border
                       rounded focus:outline-none focus:border-accent transition-colors"
          />
        </label>
      </div>

      <label className="block mt-3">
        <span className="text-[10px] uppercase tracking-wider text-foreground/40">
          Description (search results &amp; social previews)
        </span>
        <textarea
          value={meta.description}
          onChange={(e) => onChange({ description: e.target.value })}
          rows={2}
          placeholder="One or two sentences summarising the post."
          className="mt-1 w-full px-2 py-1.5 text-xs bg-surface border border-border
                     rounded resize-y focus:outline-none focus:border-accent transition-colors"
        />
      </label>

      <div className="mt-3 flex items-center gap-3">
        <span className="text-[10px] uppercase tracking-wider text-foreground/40">
          Cover
        </span>

        {meta.coverImage ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={meta.coverImage}
              alt="Cover"
              className="h-10 w-16 object-cover rounded border border-border"
            />
            <button
              type="button"
              onClick={() => onChange({ coverImage: null })}
              className="text-[11px] text-foreground/40 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </>
        ) : (
          <button
            type="button"
            disabled={uploading}
            onClick={() => coverInput.current?.click()}
            className="text-[11px] text-foreground/50 hover:text-accent transition-colors
                       disabled:opacity-40"
          >
            {uploading ? "Uploading..." : "Upload image"}
          </button>
        )}

        <input
          ref={coverInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await onUploadCover(file);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}
