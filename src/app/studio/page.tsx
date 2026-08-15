import { getSupabase } from "@/lib/supabase";
import { toPostRecord, type PostRecord } from "@/lib/types";
import PostList from "@/components/studio/PostList";

// The studio always reflects the database as-is; never serve it from cache.
export const dynamic = "force-dynamic";

export default async function StudioHome() {
  let posts: PostRecord[] = [];
  let error: string | null = null;

  try {
    const { data, error: dbError } = await getSupabase()
      .from("posts")
      .select("*")
      .order("updated_at", { ascending: false });

    if (dbError) throw dbError;
    posts = (data ?? []).map(toPostRecord);
  } catch (err) {
    error = err instanceof Error ? err.message : "Could not reach the database.";
  }

  return <PostList posts={posts} loadError={error} />;
}
