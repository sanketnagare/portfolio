import { NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";
import { toPostRecord, EMPTY_DOC } from "@/lib/types";

export const runtime = "nodejs";

/** List every post, drafts included. Studio-only. */
export async function GET() {
  const { data, error } = await getSupabase()
    .from("posts")
    .select("*")
    .order("updated_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ posts: (data ?? []).map(toPostRecord) });
}

/** Create an empty draft and hand back its id so the editor can open it. */
export async function POST() {
  const suffix = Math.random().toString(36).slice(2, 8);

  const { data, error } = await getSupabase()
    .from("posts")
    .insert({
      title: "Untitled post",
      slug: `untitled-${suffix}`,
      description: "",
      content: EMPTY_DOC,
      status: "draft",
    })
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ post: toPostRecord(data) }, { status: 201 });
}
