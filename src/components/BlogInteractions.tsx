"use client";

import { useState, useEffect, useCallback } from "react";

interface Comment {
  name: string;
  comment: string;
  date: string;
}

interface BlogInteractionsProps {
  slug: string;
}

const SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || "";

/**
 * Google Apps Script returns a 302 redirect on POST.
 * Using redirect: 'follow' + no custom headers avoids preflight
 * and lets the browser follow the redirect to get the JSON response.
 */
async function gsheetPost(payload: Record<string, string>) {
  const res = await fetch(SCRIPT_URL, {
    method: "POST",
    redirect: "follow",
    body: JSON.stringify(payload),
  });
  return res.json();
}

/**
 * Fire-and-forget POST for writes (likes/comments).
 * We use mode: 'no-cors' as a fallback so the request always goes through
 * even if the browser blocks the redirect response.
 */
async function gsheetWrite(payload: Record<string, string>) {
  try {
    // First try normal cors mode
    const res = await fetch(SCRIPT_URL, {
      method: "POST",
      redirect: "follow",
      body: JSON.stringify(payload),
    });
    return await res.json();
  } catch {
    // If CORS blocks the response, fall back to no-cors.
    // The request still reaches the server and data is written,
    // we just can't read the response.
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      redirect: "follow",
      body: JSON.stringify(payload),
    });
    return { success: true };
  }
}

export default function BlogInteractions({ slug }: BlogInteractionsProps) {
  const [mounted, setMounted] = useState(false);
  const [likes, setLikes] = useState<number>(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isLiking, setIsLiking] = useState(false);
  const [liked, setLiked] = useState(false);

  const [name, setName] = useState("");
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchData = useCallback(async () => {
    if (!SCRIPT_URL) {
      setIsLoading(false);
      return;
    }

    try {
      const data = await gsheetPost({ action: "getData", slug });
      if (data.likes !== undefined) setLikes(data.likes);
      if (data.comments) setComments(data.comments);
    } catch (err) {
      console.error("Error fetching interactions:", err);
    } finally {
      setIsLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    if (mounted) fetchData();
  }, [fetchData, mounted]);

  const handleLike = async () => {
    if (!SCRIPT_URL || liked || isLiking) return;
    
    setIsLiking(true);
    setLikes(prev => prev + 1);
    setLiked(true);

    try {
      await gsheetWrite({ action: "updateLike", slug });
    } catch (error) {
      console.error("Error adding like:", error);
      setLikes(prev => prev - 1);
      setLiked(false);
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !SCRIPT_URL || isSubmitting) return;

    setIsSubmitting(true);
    const dateStr = new Date().toISOString();
    
    const tempComment: Comment = {
      name: name.trim() || "Anonymous",
      comment: newComment.trim(),
      date: dateStr
    };
    
    setComments(prev => [...prev, tempComment]);
    const savedName = name;
    const savedComment = newComment;
    setName("");
    setNewComment("");

    try {
      await gsheetWrite({ 
        action: "addComment", 
        slug, 
        name: savedName.trim(), 
        comment: savedComment.trim() 
      });
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!mounted) return null;

  if (!SCRIPT_URL) {
    return (
      <div className="mt-12 p-6 border border-amber-500/30 bg-amber-500/10 rounded-xl text-amber-700 dark:text-amber-400 text-sm text-center">
        To enable Comments and Likes, add NEXT_PUBLIC_GOOGLE_SHEET_URL to your environment variables and restart the server.
      </div>
    );
  }

  return (
    <div className="mt-16 pt-8 border-t border-border">
      {/* LIKES SECTION */}
      <div className="flex items-center gap-4 mb-10">
        <button
          onClick={handleLike}
          disabled={liked || isLiking || isLoading}
          className={`group flex items-center gap-2 px-4 py-2 rounded-full border transition-all ${
            liked 
              ? "bg-rose-500/10 border-rose-500/30 text-rose-500" 
              : "border-border hover:border-rose-500/30 hover:bg-rose-500/5 text-foreground/70 hover:text-rose-500"
          }`}
          aria-label="Like post"
        >
          <svg 
            className={`w-5 h-5 transition-transform ${liked ? "scale-110 fill-rose-500 stroke-rose-500" : "fill-none stroke-current group-hover:scale-110"}`} 
            viewBox="0 0 24 24" 
            strokeWidth={1.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          <span className="font-medium text-sm">{isLoading ? "..." : likes}</span>
        </button>
        <span className="text-sm text-foreground/50">
          {liked ? "Thanks for liking!" : "Did you find this helpful?"}
        </span>
      </div>

      {/* COMMENTS SECTION */}
      <div>
        <h3 className="font-heading text-xl font-bold mb-6">Comments ({isLoading ? "..." : comments.length})</h3>
        
        <form onSubmit={handleAddComment} className="mb-10 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground/70">Name</label>
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
          <div>
            <label htmlFor="comment" className="block text-sm font-medium mb-1 text-foreground/70">Comment</label>
            <textarea
              id="comment"
              required
              rows={3}
              maxLength={1000}
              placeholder="What are your thoughts?"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full px-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors resize-y"
            ></textarea>
          </div>
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
              <div className="h-24 bg-border/30 rounded-lg"></div>
              <div className="h-24 bg-border/30 rounded-lg"></div>
            </div>
          ) : comments.length === 0 ? (
            <p className="text-foreground/50 italic text-sm">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="p-4 rounded-lg border border-border/50 bg-foreground/[0.02]">
                <div className="flex items-center justify-between mb-2">
                  <strong className="font-semibold text-accent">{c.name}</strong>
                  <time className="text-xs text-foreground/50">
                    {new Date(c.date).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric'
                    })}
                  </time>
                </div>
                <p className="text-foreground/80 text-sm whitespace-pre-wrap">{c.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
