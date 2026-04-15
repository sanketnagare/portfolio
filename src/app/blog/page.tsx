import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getAllPosts } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <div className="pt-28 pb-10">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight mb-2">
            Blog
          </h1>
          <p className="text-foreground/60">
            Notes on AI, backend engineering, and things I learn along the way.
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-foreground/50">No posts yet. Check back soon.</p>
          </div>
        ) : (
          <div className="space-y-0">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="block py-5 border-b border-border/60 hover:bg-surface-light/50 -mx-3 px-3 rounded transition-colors"
              >
                <div className="flex items-baseline justify-between gap-4">
                  <h2 className="font-heading font-semibold text-foreground text-sm hover:text-accent transition-colors">
                    {post.title}
                  </h2>
                  <span className="text-xs text-foreground/40 whitespace-nowrap shrink-0">
                    {post.date}
                  </span>
                </div>
                {post.description && (
                  <p className="text-xs text-foreground/50 mt-1 leading-relaxed">
                    {post.description}
                  </p>
                )}
                {post.tags && post.tags.length > 0 && (
                  <div className="flex gap-2 mt-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="text-[10px] text-foreground/30 uppercase tracking-wide">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
