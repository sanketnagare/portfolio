import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { getLikeState, isPublishedSlug } from "@/lib/interactions";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

/** Toggles this visitor's like and returns the resulting state. */
export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  let visitorId: unknown;
  try {
    ({ visitorId } = await request.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  if (typeof visitorId !== "string" || visitorId.length < 8 || visitorId.length > 64) {
    return NextResponse.json({ error: "Invalid visitor id." }, { status: 400 });
  }

  if (!(await isPublishedSlug(slug))) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }

  const supabase = getSupabase();

  const { data: existing } = await supabase
    .from("likes")
    .select("visitor_id")
    .eq("slug", slug)
    .eq("visitor_id", visitorId)
    .maybeSingle();

  if (existing) {
    await supabase.from("likes").delete().eq("slug", slug).eq("visitor_id", visitorId);
  } else {
    // Ignore the duplicate-key case: two rapid clicks should settle as liked,
    // not error.
    await supabase.from("likes").insert({ slug, visitor_id: visitorId });
  }

  return NextResponse.json(await getLikeState(slug, visitorId));
}
