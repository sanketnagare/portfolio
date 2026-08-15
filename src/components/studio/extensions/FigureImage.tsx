"use client";

import Image from "@tiptap/extension-image";
import {
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import { useState } from "react";

/**
 * The built-in Image node plus the things a real blog post needs: alt text for
 * accessibility and SEO, a visible caption, and an attribution link for images
 * borrowed from elsewhere.
 *
 * Keeps the node name "image" so posts written before this existed still parse.
 */

function FigureImageView({ node, updateAttributes, deleteNode }: NodeViewProps) {
  const { src, alt, caption, creditText, creditUrl } = node.attrs as Record<
    string,
    string
  >;
  const [showDetails, setShowDetails] = useState(false);

  const field =
    "w-full px-2 py-1 text-xs bg-background border border-border rounded " +
    "focus:outline-none focus:border-accent transition-colors";

  return (
    <NodeViewWrapper className="my-6">
      <figure className="border border-border rounded overflow-hidden bg-surface">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={alt || ""} className="w-full block" />

        <figcaption className="p-3 border-t border-border">
          <input
            value={caption || ""}
            onChange={(e) => updateAttributes({ caption: e.target.value })}
            placeholder="Add a caption (optional)"
            className={field}
          />

          <div className="flex items-center gap-3 mt-2">
            <button
              type="button"
              onClick={() => setShowDetails(!showDetails)}
              className="text-[11px] text-foreground/50 hover:text-accent transition-colors"
            >
              {showDetails ? "Hide details" : "Alt text & credit"}
            </button>

            {creditText && !showDetails && (
              <span className="text-[11px] text-foreground/35 truncate">
                Credit: {creditText}
              </span>
            )}

            <button
              type="button"
              onClick={deleteNode}
              className="ml-auto text-[11px] text-foreground/30 hover:text-red-500 transition-colors"
            >
              Remove
            </button>
          </div>

          {showDetails && (
            <div className="mt-2 grid gap-2">
              <label className="block">
                <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                  Alt text — describes the image for screen readers and search
                </span>
                <input
                  value={alt || ""}
                  onChange={(e) => updateAttributes({ alt: e.target.value })}
                  placeholder="A spreadsheet with two tabs open"
                  className={`${field} mt-1`}
                />
              </label>

              <div className="grid gap-2 sm:grid-cols-2">
                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                    Credit
                  </span>
                  <input
                    value={creditText || ""}
                    onChange={(e) => updateAttributes({ creditText: e.target.value })}
                    placeholder="Photo by Jane Doe on Unsplash"
                    className={`${field} mt-1`}
                  />
                </label>

                <label className="block">
                  <span className="text-[10px] uppercase tracking-wider text-foreground/40">
                    Credit link
                  </span>
                  <input
                    value={creditUrl || ""}
                    onChange={(e) => updateAttributes({ creditUrl: e.target.value })}
                    placeholder="https://unsplash.com/..."
                    className={`${field} mt-1`}
                  />
                </label>
              </div>
            </div>
          )}
        </figcaption>
      </figure>
    </NodeViewWrapper>
  );
}

export const FigureImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      caption: { default: "" },
      creditText: { default: "" },
      creditUrl: { default: "" },
    };
  },

  addNodeView() {
    return ReactNodeViewRenderer(FigureImageView);
  },
});
