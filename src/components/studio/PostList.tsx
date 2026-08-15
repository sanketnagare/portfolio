"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { PostRecord } from "@/lib/types";

export default function PostList({
  posts,
  loadError,
}: {
  posts: PostRecord[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  async function createPost() {
    setBusy(true);
    try {
      const res = await fetch("/api/admin/posts", { method: "POST" });
      const data = await res.json();
      if (res.ok) router.push(`/studio/posts/${data.post.id}`);
      else alert(data.error ?? "Could not create the post.");
    } finally {
      setBusy(false);
    }
  }

  async function deletePost(post: PostRecord) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${post.id}`, { method: "DELETE" });
      if (res.ok) router.refresh();
      else alert("Could not delete the post.");
    } finally {
      setBusy(false);
    }
  }

  async function signOut() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/studio/login");
    router.refresh();
  }

  function Section({ label, items }: { label: string; items: PostRecord[] }) {
    if (items.length === 0) return null;

    return (
      <section className="mb-10">
        <h2 className="text-[10px] uppercase tracking-wider text-foreground/40 mb-3">
          {label} · {items.length}
        </h2>
        <div className="border-t border-border/60">
          {items.map((post) => (
            <div
              key={post.id}
              className="flex items-center gap-4 py-3 border-b border-border/60 group"
            >
              <Link href={`/studio/posts/${post.id}`} className="flex-1 min-w-0">
                <div className="font-heading text-sm font-medium truncate group-hover:text-accent transition-colors">
                  {post.title || "Untitled post"}
                </div>
                <div className="text-xs text-foreground/40 truncate">
                  /{post.slug}
                  {post.publishedAt &&
                    ` · ${new Date(post.publishedAt).toISOString().slice(0, 10)}`}
                </div>
              </Link>

              {post.status === "published" && (
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-foreground/40 hover:text-accent transition-colors"
                >
                  View
                </a>
              )}

              <button
                onClick={() => deletePost(post)}
                disabled={busy}
                className="text-xs text-foreground/30 hover:text-red-500 transition-colors
                           disabled:opacity-40"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-heading text-2xl font-bold tracking-tight">Studio</h1>
          <p className="text-xs text-foreground/50 mt-1">
            {published.length} published · {drafts.length} draft
            {drafts.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={signOut}
            className="text-xs text-foreground/40 hover:text-foreground transition-colors"
          >
            Sign out
          </button>
          <button
            onClick={createPost}
            disabled={busy}
            className="px-3 py-1.5 text-xs font-medium rounded bg-accent text-white
                       hover:bg-accent-light disabled:opacity-40 transition-colors"
          >
            New post
          </button>
        </div>
      </div>

      {loadError && (
        <p className="mb-8 px-3 py-2 text-xs text-red-500 bg-red-500/10 rounded">
          {loadError}
        </p>
      )}

      <Section label="Drafts" items={drafts} />
      <Section label="Published" items={published} />

      {!loadError && posts.length === 0 && (
        <p className="text-sm text-foreground/50">
          No posts yet. Hit &ldquo;New post&rdquo; to start writing.
        </p>
      )}
    </main>
  );
}
