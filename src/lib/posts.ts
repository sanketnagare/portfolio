import "server-only";
import { unstable_cache } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import {
  formatPostDate,
  toPostRecord,
  type PostMeta,
  type PostRecord,
} from "@/lib/types";

export type { PostMeta } from "@/lib/types";

/**
 * Every published-post read goes through this cache tag. The admin API calls
 * revalidateTag(POSTS_TAG) on write, so the public pages stay statically
 * cached but pick up edits within a request of publishing.
 */
export const POSTS_TAG = "posts";

const LIST_COLUMNS =
  "slug, title, description, cover_image, tags, published_at, updated_at";

async function fetchPublishedPosts(): Promise<PostMeta[]> {
  try {
    const { data, error } = await getSupabase()
      .from("posts")
      .select(LIST_COLUMNS)
      .eq("status", "published")
      .order("published_at", { ascending: false });

    if (error) throw error;

    return (data ?? []).map((row) => ({
      slug: row.slug,
      title: row.title,
      date: formatPostDate(row.published_at),
      description: row.description ?? "",
      coverImage: row.cover_image ?? null,
      tags: row.tags ?? [],
      updatedAt: row.updated_at,
    }));
  } catch (err) {
    // A blog outage should not take the whole portfolio down.
    console.error("[posts] failed to load published posts:", err);
    return [];
  }
}

async function fetchPublishedPost(slug: string): Promise<PostRecord | null> {
  try {
    const { data, error } = await getSupabase()
      .from("posts")
      .select("*")
      .eq("slug", slug)
      .eq("status", "published")
      .maybeSingle();

    if (error) throw error;
    return data ? toPostRecord(data) : null;
  } catch (err) {
    console.error(`[posts] failed to load post "${slug}":`, err);
    return null;
  }
}

export const getAllPosts = unstable_cache(fetchPublishedPosts, ["published-posts"], {
  tags: [POSTS_TAG],
});

export const getPostBySlug = unstable_cache(
  fetchPublishedPost,
  ["published-post"],
  { tags: [POSTS_TAG] }
);

export async function getAllPostSlugs(): Promise<string[]> {
  const posts = await getAllPosts();
  return posts.map((p) => p.slug);
}
