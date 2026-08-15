import { NextResponse, type NextRequest } from "next/server";
import { getComments, getLikeState, isPublishedSlug } from "@/lib/interactions";

export const runtime = "nodejs";
// Reader-facing counts should never be served stale from a cache.
export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

/** Everything BlogInteractions needs for a post, in one round trip. */
export async function GET(request: NextRequest, { params }: Params) {
  const { slug } = await params;
  const visitorId = request.nextUrl.searchParams.get("visitor");

  if (!(await isPublishedSlug(slug))) {
    return NextResponse.json({ error: "Unknown post." }, { status: 404 });
  }

  try {
    const [{ likes, liked }, comments] = await Promise.all([
      getLikeState(slug, visitorId),
      getComments(slug),
    ]);

    return NextResponse.json({ likes, liked, comments });
  } catch (err) {
    console.error(`[interactions] ${slug}:`, err);
    return NextResponse.json({ error: "Could not load." }, { status: 500 });
  }
}
