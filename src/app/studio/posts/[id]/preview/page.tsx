import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostArticle from "@/components/blog/PostArticle";
import { getSupabase } from "@/lib/supabase";
import { formatPostDate, toPostRecord } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function PreviewPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) notFound();

  const post = toPostRecord(data);

  return (
    <>
      <Navbar />
      <div className="fixed top-14 left-0 right-0 z-40 bg-accent/90 text-white text-center text-[11px] py-1">
        Preview — {post.status === "published" ? "live" : "not published yet"}
      </div>
      <PostArticle
        title={post.title}
        date={formatPostDate(post.publishedAt) || "Unpublished"}
        tags={post.tags}
        coverImage={post.coverImage}
        doc={post.content}
        backHref={`/studio/posts/${post.id}`}
        backLabel="Back to editor"
      />
    </>
  );
}
