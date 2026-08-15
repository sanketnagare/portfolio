"use client";

import { useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { marked } from "marked";

function Button({
  onClick,
  active,
  title,
  children,
  disabled,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      disabled={disabled}
      className={`px-2 py-1 text-xs rounded transition-colors disabled:opacity-40 ${
        active
          ? "bg-accent text-white"
          : "text-foreground/60 hover:text-foreground hover:bg-surface-light"
      }`}
    >
      {children}
    </button>
  );
}

const Divider = () => <span className="w-px h-4 bg-border mx-1" />;

export default function Toolbar({
  editor,
  onUploadImage,
  uploading,
}: {
  editor: Editor;
  onUploadImage: (file: File) => Promise<void>;
  uploading: boolean;
}) {
  const fileInput = useRef<HTMLInputElement>(null);
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [markdown, setMarkdown] = useState("");

  function addLink() {
    const previous = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previous ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  function addImageFromUrl() {
    const src = window.prompt(
      "Image URL (from Unsplash, a CDN, anywhere public)"
    );
    if (!src) return;
    if (!/^https?:\/\//i.test(src)) {
      alert("Only http(s) image URLs are supported.");
      return;
    }
    const creditText =
      window.prompt("Credit line (optional) — e.g. Photo by Jane Doe") ?? "";
    const creditUrl = creditText
      ? window.prompt("Link for that credit (optional)") ?? ""
      : "";

    editor
      .chain()
      .focus()
      .setImage({ src })
      .updateAttributes("image", { creditText, creditUrl })
      .run();
  }

  function addYoutube() {
    const url = window.prompt("YouTube URL");
    if (!url) return;
    editor.commands.setYoutubeVideo({ src: url, width: 800, height: 450 });
  }

  function importMarkdown() {
    if (!markdown.trim()) return;
    // Tiptap parses HTML into its own nodes, so Markdown -> HTML -> nodes is
    // the shortest safe path for pasting Claude output.
    const html = marked.parse(markdown, { async: false }) as string;
    editor.chain().focus().insertContent(html).run();
    setMarkdown("");
    setShowMarkdown(false);
  }

  return (
    <div className="sticky top-0 z-20 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="flex items-center flex-wrap gap-0.5 py-2">
        <Button
          title="Heading 2"
          active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        >
          H2
        </Button>
        <Button
          title="Heading 3"
          active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        >
          H3
        </Button>

        <Divider />

        <Button
          title="Bold"
          active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <strong>B</strong>
        </Button>
        <Button
          title="Italic"
          active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <em>I</em>
        </Button>
        <Button
          title="Inline code"
          active={editor.isActive("code")}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          {"</>"}
        </Button>
        <Button title="Link" active={editor.isActive("link")} onClick={addLink}>
          Link
        </Button>

        <Divider />

        <Button
          title="Bullet list"
          active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          List
        </Button>
        <Button
          title="Numbered list"
          active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          1.
        </Button>
        <Button
          title="Quote"
          active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          Quote
        </Button>
        <Button
          title="Code block"
          active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          Code
        </Button>
        <Button
          title="Divider"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          —
        </Button>

        <Divider />

        <Button
          title="Upload an image from this device"
          disabled={uploading}
          onClick={() => fileInput.current?.click()}
        >
          {uploading ? "Uploading..." : "Image"}
        </Button>
        <Button
          title="Insert an image hosted somewhere else, with a credit line"
          onClick={addImageFromUrl}
        >
          Image URL
        </Button>
        <Button title="Embed a YouTube video" onClick={addYoutube}>
          YouTube
        </Button>
        <Button
          title="Insert an HTML/CSS/JS animation block"
          onClick={() => editor.commands.insertAnimationEmbed()}
        >
          Animation
        </Button>

        <Divider />

        <Button
          title="Paste Markdown from Claude"
          active={showMarkdown}
          onClick={() => setShowMarkdown(!showMarkdown)}
        >
          Markdown
        </Button>

        <input
          ref={fileInput}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
          className="hidden"
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (file) await onUploadImage(file);
            e.target.value = "";
          }}
        />
      </div>

      {showMarkdown && (
        <div className="pb-3">
          <textarea
            value={markdown}
            onChange={(e) => setMarkdown(e.target.value)}
            placeholder="Paste Markdown here, then hit Insert."
            className="w-full h-40 p-3 font-mono text-xs bg-surface border border-border
                       rounded resize-y focus:outline-none focus:border-accent"
          />
          <div className="flex gap-2 mt-2">
            <button
              type="button"
              onClick={importMarkdown}
              disabled={!markdown.trim()}
              className="px-3 py-1.5 text-xs font-medium rounded bg-accent text-white
                         hover:bg-accent-light disabled:opacity-40 transition-colors"
            >
              Insert at cursor
            </button>
            <button
              type="button"
              onClick={() => setShowMarkdown(false)}
              className="px-3 py-1.5 text-xs text-foreground/50 hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
