import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { getSupabase } from "@/lib/supabase";
import { POSTS_TAG } from "@/lib/posts";
import { slugify, toPostRecord } from "@/lib/types";

export const runtime = "nodejs";

type Params = { params: Promise<{ id: string }> };

/**
 * Flush every cached surface a post can appear on. Called on any write so a
 * publish shows up on the live site without a rebuild.
 */
function refreshPublicPages(slugs: (string | null | undefined)[]) {
  // Next 16 wants an explicit cache-life profile; "max" fully invalidates.
  revalidateTag(POSTS_TAG, "max");
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  for (const slug of new Set(slugs.filter(Boolean))) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function GET(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ post: toPostRecord(data) });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;
  const supabase = getSupabase();

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  const { data: existing, error: readError } = await supabase
    .from("posts")
    .select("slug, status, published_at")
    .eq("id", id)
    .maybeSingle();

  if (readError) {
    return NextResponse.json({ error: readError.message }, { status: 500 });
  }
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const update: Record<string, unknown> = {};

  if (typeof body.title === "string") update.title = body.title.slice(0, 200);
  if (typeof body.description === "string") {
    update.description = body.description.slice(0, 500);
  }
  if (typeof body.coverImage === "string" || body.coverImage === null) {
    update.cover_image = body.coverImage || null;
  }
  if (Array.isArray(body.tags)) {
    update.tags = body.tags
      .filter((t): t is string => typeof t === "string")
      .map((t) => t.trim())
      .filter(Boolean)
      .slice(0, 10);
  }
  if (body.content && typeof body.content === "object") {
    update.content = body.content;
  }

  if (typeof body.slug === "string") {
    const nextSlug = slugify(body.slug);
    if (!nextSlug) {
      return NextResponse.json({ error: "Slug cannot be empty." }, { status: 400 });
    }
    update.slug = nextSlug;
  }

  if (body.status === "draft" || body.status === "published") {
    update.status = body.status;
    // Stamp the publish date the first time it goes live, then leave it alone
    // so re-publishing an edited post does not reorder the blog.
    if (body.status === "published" && !existing.published_at) {
      update.published_at = new Date().toISOString();
    }
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: "Nothing to update." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("posts")
    .update(update)
    .eq("id", id)
    .select("*")
    .single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json(
        { error: "That slug is already taken." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  refreshPublicPages([existing.slug, data.slug]);

  return NextResponse.json({ post: toPostRecord(data) });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  const { data, error } = await getSupabase()
    .from("posts")
    .delete()
    .eq("id", id)
    .select("slug")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  refreshPublicPages([data?.slug]);

  return NextResponse.json({ ok: true });
}
