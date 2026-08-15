"use client";

import StarterKit from "@tiptap/starter-kit";
import Youtube from "@tiptap/extension-youtube";
import Placeholder from "@tiptap/extension-placeholder";
import { AnimationEmbed } from "./AnimationEmbed";
import { FigureImage } from "./FigureImage";

/**
 * The editor's node/mark vocabulary. RenderTiptap on the public side knows how
 * to draw every type registered here -- if you add an extension, add a case
 * there too or the node will silently render as nothing.
 */
export const editorExtensions = [
  StarterKit.configure({
    // The blog design only styles h2/h3; h1 is the post title itself.
    heading: { levels: [2, 3, 4] },
    link: {
      openOnClick: false,
      autolink: true,
      HTMLAttributes: { rel: "noopener noreferrer", target: "_blank" },
    },
  }),
  FigureImage.configure({ allowBase64: false }),
  Youtube.configure({
    controls: true,
    nocookie: true,
    width: 800,
    height: 450,
  }),
  Placeholder.configure({
    placeholder: "Start writing, or paste Markdown from Claude...",
  }),
  AnimationEmbed,
];
