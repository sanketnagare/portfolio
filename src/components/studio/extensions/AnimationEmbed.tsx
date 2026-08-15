"use client";

import { Node, mergeAttributes } from "@tiptap/core";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useState } from "react";

/**
 * A block holding raw HTML/CSS/JS -- the escape hatch for animations and
 * anything else Claude hands you as a self-contained snippet.
 *
 * It renders inside a sandboxed iframe with `allow-scripts` but deliberately
 * WITHOUT `allow-same-origin`, so the snippet gets a unique opaque origin and
 * cannot touch the page's DOM, cookies, or storage.
 */

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    animationEmbed: {
      insertAnimationEmbed: (attrs?: { html?: string; height?: number }) => ReturnType;
    };
  }
}

const STARTER = `<style>
  body { margin: 0; display: grid; place-items: center; height: 100vh;
         background: transparent; font-family: system-ui, sans-serif; }
  .box { width: 60px; height: 60px; border-radius: 12px;
         background: #c45d2c; animation: spin 2s ease-in-out infinite; }
  @keyframes spin { 50% { transform: rotate(180deg) scale(1.3); } }
</style>
<div class="box"></div>`;

function AnimationEmbedView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const html = (node.attrs.html as string) || "";
  const height = (node.attrs.height as number) || 400;
  const [editing, setEditing] = useState(!html);
  const [draft, setDraft] = useState(html || STARTER);

  return (
    <NodeViewWrapper className="my-6">
      <div className="border border-border rounded overflow-hidden bg-surface">
        <div className="flex items-center gap-3 px-3 py-1.5 border-b border-border bg-surface-light">
          <span className="text-[10px] uppercase tracking-wider text-foreground/40">
            Animation
          </span>

          <div className="ml-auto flex items-center gap-3">
            <label className="flex items-center gap-1 text-[10px] text-foreground/40">
              Height
              <input
                type="number"
                min={80}
                max={1200}
                value={height}
                onChange={(e) =>
                  updateAttributes({ height: Number(e.target.value) || 400 })
                }
                className="w-16 px-1 py-0.5 bg-background border border-border rounded
                           text-foreground text-[11px]"
              />
            </label>

            <button
              type="button"
              onClick={() => {
                if (editing) updateAttributes({ html: draft });
                setEditing(!editing);
              }}
              className="text-[11px] text-foreground/50 hover:text-accent transition-colors"
            >
              {editing ? "Preview" : "Edit code"}
            </button>

            <button
              type="button"
              onClick={deleteNode}
              className="text-[11px] text-foreground/30 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>
        </div>

        {editing ? (
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={() => updateAttributes({ html: draft })}
            spellCheck={false}
            placeholder="Paste self-contained HTML / CSS / JS here"
            className="w-full p-3 font-mono text-xs bg-surface text-foreground
                       resize-y focus:outline-none"
            style={{ height }}
          />
        ) : (
          <iframe
            srcDoc={html}
            sandbox="allow-scripts"
            loading="lazy"
            title="Animation preview"
            className="w-full block bg-transparent"
            style={{ height, border: "none" }}
          />
        )}
      </div>
    </NodeViewWrapper>
  );
}

export const AnimationEmbed = Node.create({
  name: "animationEmbed",
  group: "block",
  atom: true,
  draggable: true,
  selectable: true,

  addAttributes() {
    return {
      html: { default: "" },
      height: { default: 400 },
    };
  },

  parseHTML() {
    return [{ tag: "div[data-animation-embed]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-animation-embed": "" }),
    ];
  },

  addNodeView() {
    return ReactNodeViewRenderer(AnimationEmbedView);
  },

  addCommands() {
    return {
      insertAnimationEmbed:
        (attrs = {}) =>
        ({ commands }) =>
          commands.insertContent({
            type: this.name,
            attrs: { html: attrs.html ?? "", height: attrs.height ?? 400 },
          }),
    };
  },
});
