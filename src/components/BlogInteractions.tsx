"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

interface BlogInteractionsProps {
  slug: string;
}

const VISITOR_KEY = "blog_visitor_id";

/**
 * A random per-browser id, used to make likes idempotent -- one like per
 * visitor per post, and the button still reads "liked" after a reload.
 * Not an identity: it is generated locally and never tied to anything.
 */
function getVisitorId(): string {
  let id = localStorage.getItem(VISITOR_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(VISITOR_KEY, id);
  }
  return id;
}

export default function BlogInteractions({ slug }: BlogInteractionsProps) {
  const [mounted, setMounted] = useState(false);
  const [likes, setLikes] = useState(0);
  const [liked, setLiked] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLiking, setIsLiking] = useState(false);

  const [name, setName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [website, setWebsite] = useState(""); // honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(
        `/api/blog/${slug}/interactions?visitor=${encodeURIComponent(getVisitorId())}`
      );
      if (!res.ok) return;

      const data = await res.json();
      setLikes(data.likes ?? 0);
      setLiked(Boolean(data.liked));
      setComments(data.comments ?? []);
    } catch (err) {
      console.error("Error fetching interactions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (mounted) fetchData();
  }, [fetchData, mounted]);

  async function handleLike() {
    if (isLiking) return;
    setIsLiking(true);

    // Optimistic toggle, rolled back if the request fails.
    const previous = { likes, liked };
    setLikes((n) => n + (liked ? -1 : 1));
    setLiked(!liked);

    try {
      const res = await fetch(`/api/blog/${slug}/like`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visitorId: getVisitorId() }),
      });

      if (!res.ok) throw new Error("like failed");

      const data = await res.json();
      setLikes(data.likes);
      setLiked(data.liked);
    } catch {
      setLikes(previous.likes);
      setLiked(previous.liked);
    } finally {
      setIsLiking(false);
    }
  }

  async function handleAddComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/blog/${slug}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, comment: newComment, website }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setError(data.error ?? "Could not post your comment.");
        return;
      }

      if (data.comment) setComments((prev) => [...prev, data.comment]);
      setName("");
      setNewComment("");
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!mounted) return null;

  return (
    <div className="mt-16 pt-8 border-t border-border">
      {/* LIKES SECTION */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleLike}
          disabled={isLiking || isLoading}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all disabled:opacity-60 ${
            liked
              ? "bg-rose-500/10 border-rose-500/30 text-rose-500"
              : "border-border hover:border-rose-500/30 hover:bg-rose-500/5 text-foreground/70 hover:text-rose-500"
          }`}
          aria-label={liked ? "Remove like" : "Like post"}
          aria-pressed={liked}
        >
          <svg
            className={`w-5 h-5 transition-transform ${
              liked
                ? "scale-110 fill-rose-500 stroke-rose-500"
                : "fill-none stroke-current group-hover:scale-110"
            }`}
            viewBox="0 0 24 24"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
            />
          </svg>
          <span className="font-medium text-sm">{isLoading ? "..." : likes}</span>
        </button>
        <span className="text-sm text-foreground/50">
          {liked ? "Thanks for liking!" : "Did you find this helpful?"}
        </span>
      </div>

      {/* COMMENTS SECTION */}
      <div>
        <h3 className="font-heading text-xl font-bold mb-6">
          Comments ({isLoading ? "..." : comments.length})
        </h3>

        <form onSubmit={handleAddComment} className="mb-10 space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium mb-1 text-foreground/70"
            >
              Name
            </label>
            <input
              id="name"
              type="text"
              maxLength={50}
              placeholder="How should we call you?"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"
            />
          </div>

          {/* Honeypot -- hidden from people, irresistible to bots. */}
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="hidden"
          />

          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium mb-1 text-foreground/70"
            >
              Comment
            </label>
            <textarea
              id="comment"
              required
              rows={3}
              maxLength={1000}
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-y"
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-5 py-2.5 bg-accent text-white font-medium rounded-lg hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Posting..." : "Post Comment"}
          </button>
        </form>

        <div className="space-y-6">
          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-4">
              <div className="h-24 bg-border/30 rounded-lg" />
              <div className="h-24 bg-border/30 rounded-lg" />
            </div>
          ) : comments.length === 0 ? (
            <p className="text-foreground/50 italic text-sm">
              No comments yet. Be the first to share your thoughts!
            </p>
          ) : (
            comments.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-lg border border-border/50 bg-foreground/[0.02]"
              >
                <div className="flex items-center justify-between mb-2">
                  <strong className="font-semibold text-accent">{c.name}</strong>
                  <time className="text-xs text-foreground/50">
                    {new Date(c.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">
                  {c.body}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
