import { NextResponse, type NextRequest } from "next/server";
import { getSupabase } from "@/lib/supabase";
import {
  MAX_COMMENT,
  MAX_NAME,
  hashIp,
  isPublishedSlug,
} from "@/lib/interactions";

export const runtime = "nodejs";

type Params = { params: Promise<{ slug: string }> };

const RATE_LIMIT = 5;
const WINDOW_MINUTES = 10;

export async function POST(request: NextRequest, { params }: Params) {
  const { slug } = await params;

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }

  // Honeypot: a hidden field no human ever fills in. Accept the request so the
  // bot sees success, but store nothing.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  const comment = typeof body.comment === "string" ? body.comment.trim() : "";
  const rawName = typeof body.name === "string" ? body.name.trim() : "";
  const name = (rawName || "Anonymous").slice(0, MAX_NAME);

  if (!comment) {
    return NextResponse.json({ error: "Comment cannot be empty." }, { status: 400 });
  }
  if (comment.length > MAX_COMMENT) {
    return NextResponse.json(
      { error: `Comments are limited to ${MAX_COMMENT} characters.` },
      { status: 400 }
    );
  }

  if (!(await isPublishedSlug(slug))) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }

  const supabase = getSupabase();
  const ipHash = hashIp(request);
  const windowStart = new Date(Date.now() - WINDOW_MINUTES * 60_000).toISOString();

  const { count } = await supabase
    .from("comments")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", windowStart);

  if ((count ?? 0) >= RATE_LIMIT) {
    return NextResponse.json(
      { error: "You're commenting a little fast. Try again in a few minutes." },
      { status: 429 }
    );
  }

  const { data, error } = await supabase
    .from("comments")
    .insert({ slug, name, body: comment, ip_hash: ipHash })
    .select("id, name, body, created_at")
    .single();

  if (error) {
    console.error(`[comment] ${slug}:`, error);
    return NextResponse.json({ error: "Could not post comment." }, { status: 500 });
  }

  return NextResponse.json(
    {
      comment: {
        id: data.id,
        name: data.name,
        body: data.body,
        createdAt: data.created_at,
      },
    },
    { status: 201 }
  );
}
