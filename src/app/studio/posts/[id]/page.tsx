import { notFound } from "next/navigation";
import { getSupabase } from "@/lib/supabase";
import { toPostRecord } from "@/lib/types";
import Editor from "@/components/studio/Editor";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
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

  return <Editor post={toPostRecord(data)} />;
}
