import "server-only";
import { createHash } from "node:crypto";
import type { NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";

/** Shapes shared between the interaction routes and BlogInteractions. */
export interface PublicComment {
  id: string;
  name: string;
  body: string;
  createdAt: string;
}

export const MAX_NAME = 50;
export const MAX_COMMENT = 1000;

/**
 * Hash the caller's IP before storing it. Rate limiting only needs to know
 * "same person as before", not who they are, so keeping the raw address would
 * be collecting personal data for no reason.
 */
export function hashIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const ip =
    forwarded?.split(",")[0].trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  return createHash("sha256")
    .update(`${ip}:${process.env.AUTH_SECRET ?? ""}`)
    .digest("hex")
    .slice(0, 32);
}

/**
 * Only accept interactions for slugs that are actually published posts --
 * otherwise anyone can POST arbitrary slugs and fill the tables with junk.
 */
export async function isPublishedSlug(slug: string): Promise<boolean> {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("slug")
    .eq("slug", slug)
    .eq("status", "published")
    .maybeSingle();

  return !error && Boolean(data);
}

/** Like count plus whether this particular visitor is one of them. */
export async function getLikeState(slug: string, visitorId: string | null) {
  const supabase = getSupabase();

  const { count } = await supabase
    .from("likes")
    .select("visitor_id", { count: "exact", head: true })
    .eq("slug", slug);

  let liked = false;
  if (visitorId) {
    const { data } = await supabase
      .from("likes")
      .select("visitor_id")
      .eq("slug", slug)
      .eq("visitor_id", visitorId)
      .maybeSingle();
    liked = Boolean(data);
  }

  return { likes: count ?? 0, liked };
}

export async function getComments(slug: string): Promise<PublicComment[]> {
  const { data, error } = await getSupabase()
    .from("comments")
    .select("id, name, body, created_at")
    .eq("slug", slug)
    .eq("approved", true)
    .order("created_at", { ascending: true });

  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    body: row.body,
    createdAt: row.created_at,
  }));
}
