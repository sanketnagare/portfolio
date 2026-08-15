"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { EditorContent, useEditor } from "@tiptap/react";
import { editorExtensions } from "./extensions";
import Toolbar from "./Toolbar";
import PostMetaPanel, { type PostMetaFields } from "./PostMetaPanel";
import type { PostRecord, PostStatus } from "@/lib/types";

const AUTOSAVE_DELAY = 1500;

type SaveState = "idle" | "dirty" | "saving" | "saved" | "error";

const SAVE_LABEL: Record<SaveState, string> = {
  idle: "",
  dirty: "Unsaved changes",
  saving: "Saving...",
  saved: "Saved",
  error: "Save failed",
};

export default function Editor({ post }: { post: PostRecord }) {
  const router = useRouter();

  const [meta, setMeta] = useState<PostMetaFields>({
    title: post.title,
    slug: post.slug,
    description: post.description,
    tags: post.tags,
    coverImage: post.coverImage,
  });
  const [status, setStatus] = useState<PostStatus>(post.status);
  const [saveState, setSaveState] = useState<SaveState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Refs so the debounced save always reads current values without being
  // re-created (and re-scheduled) on every keystroke.
  const metaRef = useRef(meta);
  metaRef.current = meta;
  const slugTouchedRef = useRef(post.slug !== "" && !post.slug.startsWith("untitled-"));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Tiptap captures editorProps/onUpdate once, on the render where `editor` is
  // still undefined. Routing those handlers through refs keeps them pointing at
  // the current callbacks instead of that first, useless closure.
  const scheduleSaveRef = useRef<() => void>(() => {});
  const uploadImageRef = useRef<(file: File, target: "inline" | "cover") => void>(
    () => {}
  );

  const editor = useEditor({
    extensions: editorExtensions,
    content: post.content,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "blog-prose min-h-[50vh] focus:outline-none",
      },
      handleDrop(_view, event, _slice, moved) {
        const file = event.dataTransfer?.files?.[0];
        if (moved || !file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        uploadImageRef.current(file, "inline");
        return true;
      },
      handlePaste(_view, event) {
        const file = event.clipboardData?.files?.[0];
        if (!file || !file.type.startsWith("image/")) return false;
        event.preventDefault();
        uploadImageRef.current(file, "inline");
        return true;
      },
    },
    onUpdate: () => scheduleSaveRef.current(),
  });

  const save = useCallback(
    async (overrides: Record<string, unknown> = {}) => {
      if (!editor) return false;

      if (timer.current) {
        clearTimeout(timer.current);
        timer.current = null;
      }

      setSaveState("saving");
      setError(null);

      try {
        const res = await fetch(`/api/admin/posts/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...metaRef.current,
            content: editor.getJSON(),
            ...overrides,
          }),
        });

        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setSaveState("error");
          setError(data.error ?? "Could not save.");
          return false;
        }

        // The server owns slug normalisation, so mirror what it stored.
        if (data.post?.slug) {
          setMeta((m) => ({ ...m, slug: data.post.slug }));
        }
        setSaveState("saved");
        return true;
      } catch {
        setSaveState("error");
        setError("Network error while saving.");
        return false;
      }
    },
    [editor, post.id]
  );

  const scheduleSave = useCallback(() => {
    setSaveState("dirty");
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void save(), AUTOSAVE_DELAY);
  }, [save]);

  const uploadImage = useCallback(
    async (file: File, target: "inline" | "cover") => {
      setUploading(true);
      setError(null);

      try {
        const form = new FormData();
        form.append("file", file);

        const res = await fetch("/api/admin/upload", { method: "POST", body: form });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          setError(data.error ?? "Upload failed.");
          return;
        }

        if (target === "cover") {
          setMeta((m) => ({ ...m, coverImage: data.url }));
          scheduleSave();
        } else {
          editor?.chain().focus().setImage({ src: data.url }).run();
        }
      } catch {
        setError("Network error while uploading.");
      } finally {
        setUploading(false);
      }
    },
    [editor, scheduleSave]
  );

  scheduleSaveRef.current = scheduleSave;
  uploadImageRef.current = (file, target) => void uploadImage(file, target);

  function updateMeta(next: Partial<PostMetaFields>) {
    setMeta((m) => ({ ...m, ...next }));
    scheduleSave();
  }

  async function togglePublish() {
    const next: PostStatus = status === "published" ? "draft" : "published";
    const ok = await save({ status: next });
    if (ok) {
      setStatus(next);
      router.refresh();
    }
  }

  // Flush pending edits when the tab is hidden or closed.
  useEffect(() => {
    function onBeforeUnload(e: BeforeUnloadEvent) {
      if (saveState === "dirty" || saveState === "saving") e.preventDefault();
    }
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", onBeforeUnload);
      if (timer.current) clearTimeout(timer.current);
    };
  }, [saveState]);

  return (
    <main className="max-w-3xl mx-auto px-6 pb-32">
      <div className="flex items-center gap-4 pt-8">
        <Link
          href="/studio"
          className="text-xs text-foreground/40 hover:text-accent transition-colors"
        >
          Back
        </Link>

        <span
          className={`text-[11px] ${
            saveState === "error" ? "text-red-500" : "text-foreground/35"
          }`}
        >
          {SAVE_LABEL[saveState]}
        </span>

        <div className="ml-auto flex items-center gap-3">
          <span
            className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded ${
              status === "published"
                ? "bg-accent/15 text-accent"
                : "bg-surface-light text-foreground/40"
            }`}
          >
            {status}
          </span>

          <Link
            href={`/studio/posts/${post.id}/preview`}
            className="text-xs text-foreground/50 hover:text-accent transition-colors"
          >
            Preview
          </Link>

          <button
            onClick={() => void save()}
            disabled={saveState === "saving"}
            className="text-xs text-foreground/50 hover:text-foreground transition-colors
                       disabled:opacity-40"
          >
            Save
          </button>

          <button
            onClick={togglePublish}
            disabled={saveState === "saving"}
            className="px-3 py-1.5 text-xs font-medium rounded bg-accent text-white
                       hover:bg-accent-light disabled:opacity-40 transition-colors"
          >
            {status === "published" ? "Unpublish" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 px-3 py-2 text-xs text-red-500 bg-red-500/10 rounded">
          {error}
        </p>
      )}

      <PostMetaPanel
        meta={meta}
        onChange={updateMeta}
        onUploadCover={(file) => uploadImage(file, "cover")}
        uploading={uploading}
        slugTouchedRef={slugTouchedRef}
      />

      {editor && (
        <>
          <Toolbar
            editor={editor}
            uploading={uploading}
            onUploadImage={(file) => uploadImage(file, "inline")}
          />
          <div className="pt-6">
            <EditorContent editor={editor} />
          </div>
        </>
      )}
    </main>
  );
}
