import { Fragment, type ReactNode } from "react";
import { codeToHtml } from "shiki";
import type { TiptapDoc, TiptapNode } from "@/lib/types";

/**
 * Renders a Tiptap document as React on the server.
 *
 * Every node type the editor can produce (see components/studio/extensions)
 * needs a case here -- anything unrecognised renders as nothing rather than
 * as raw markup, which keeps stored content from becoming an injection vector.
 */

const HEADING_TAGS: Record<number, "h2" | "h3" | "h4"> = {
  2: "h2",
  3: "h3",
  4: "h4",
};

/** Pulls the video id out of any of the YouTube URL shapes. */
function youtubeId(url: string): string | null {
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([\w-]{11})/
  );
  return match ? match[1] : null;
}

async function highlight(code: string, language?: string): Promise<string> {
  try {
    return await codeToHtml(code, {
      lang: language || "text",
      theme: "github-dark",
    });
  } catch {
    // Unknown language -- fall back to no highlighting rather than 500ing.
    return codeToHtml(code, { lang: "text", theme: "github-dark" });
  }
}

function applyMarks(node: TiptapNode, content: ReactNode): ReactNode {
  if (!node.marks?.length) return content;

  return node.marks.reduce<ReactNode>((acc, mark) => {
    switch (mark.type) {
      case "bold":
        return <strong>{acc}</strong>;
      case "italic":
        return <em>{acc}</em>;
      case "strike":
        return <s>{acc}</s>;
      case "underline":
        return <u>{acc}</u>;
      case "code":
        return <code>{acc}</code>;
      case "link": {
        const href = String(mark.attrs?.href ?? "");
        // Block javascript: and data: URLs from stored content.
        const safe = /^(https?:|mailto:|#|\/)/i.test(href) ? href : "#";
        return (
          <a href={safe} target="_blank" rel="noopener noreferrer">
            {acc}
          </a>
        );
      }
      default:
        return acc;
    }
  }, content);
}

async function renderChildren(nodes: TiptapNode[] | undefined): Promise<ReactNode[]> {
  if (!nodes?.length) return [];
  const rendered = await Promise.all(nodes.map((child, i) => renderNode(child, i)));
  return rendered;
}

async function renderNode(node: TiptapNode, key: number): Promise<ReactNode> {
  switch (node.type) {
    case "text":
      return (
        <Fragment key={key}>{applyMarks(node, node.text ?? "")}</Fragment>
      );

    case "paragraph": {
      const children = await renderChildren(node.content);
      // Tiptap emits empty paragraphs for blank lines; keep them as spacing.
      return <p key={key}>{children.length ? children : <br />}</p>;
    }

    case "heading": {
      const level = Number(node.attrs?.level ?? 2);
      const Tag = HEADING_TAGS[level] ?? "h2";
      const id = headingId(node);
      return (
        <Tag key={key} id={id}>
          {await renderChildren(node.content)}
        </Tag>
      );
    }

    case "bulletList":
      return <ul key={key}>{await renderChildren(node.content)}</ul>;

    case "orderedList":
      return <ol key={key}>{await renderChildren(node.content)}</ol>;

    case "listItem":
      return <li key={key}>{await renderChildren(node.content)}</li>;

    case "blockquote":
      return <blockquote key={key}>{await renderChildren(node.content)}</blockquote>;

    case "horizontalRule":
      return <hr key={key} />;

    case "hardBreak":
      return <br key={key} />;

    case "codeBlock": {
      const code = (node.content ?? []).map((c) => c.text ?? "").join("");
      const language = node.attrs?.language as string | undefined;
      const html = await highlight(code, language);
      return (
        <div
          key={key}
          className="code-block"
          data-language={language || "text"}
          // Shiki escapes the source before emitting spans, so this is the
          // highlighter's own markup, not user HTML.
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    }

    case "image": {
      const src = String(node.attrs?.src ?? "");
      if (!/^https?:\/\//i.test(src)) return null;

      const caption = String(node.attrs?.caption ?? "").trim();
      const creditText = String(node.attrs?.creditText ?? "").trim();
      const creditUrl = String(node.attrs?.creditUrl ?? "").trim();
      const safeCreditUrl = /^https?:\/\//i.test(creditUrl) ? creditUrl : null;

      const img = (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={String(node.attrs?.alt ?? caption ?? "")}
          title={node.attrs?.title ? String(node.attrs.title) : undefined}
          loading="lazy"
        />
      );

      // A bare image stays a bare image; only wrap in <figure> when there is
      // something to say about it.
      if (!caption && !creditText) return <Fragment key={key}>{img}</Fragment>;

      return (
        <figure key={key}>
          {img}
          <figcaption>
            {caption}
            {caption && creditText && " "}
            {creditText &&
              (safeCreditUrl ? (
                <a href={safeCreditUrl} target="_blank" rel="noopener noreferrer nofollow">
                  {creditText}
                </a>
              ) : (
                <span>{creditText}</span>
              ))}
          </figcaption>
        </figure>
      );
    }

    case "youtube": {
      const id = youtubeId(String(node.attrs?.src ?? ""));
      if (!id) return null;
      return (
        <div
          key={key}
          className="my-6 relative w-full overflow-hidden rounded-lg"
          style={{ aspectRatio: "16 / 9" }}
        >
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}`}
            title="YouTube video"
            loading="lazy"
            allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
            style={{ border: "none" }}
          />
        </div>
      );
    }

    case "animationEmbed": {
      const html = String(node.attrs?.html ?? "");
      if (!html.trim()) return null;
      const height = Number(node.attrs?.height ?? 400);
      return (
        <iframe
          key={key}
          srcDoc={html}
          // allow-scripts WITHOUT allow-same-origin: the snippet runs in a
          // unique opaque origin and cannot reach this page's DOM or cookies.
          sandbox="allow-scripts"
          loading="lazy"
          title="Embedded animation"
          className="my-6 w-full block rounded-lg"
          style={{ height, border: "none" }}
        />
      );
    }

    case "doc":
      return <Fragment key={key}>{await renderChildren(node.content)}</Fragment>;

    default:
      return null;
  }
}

/** Slug for a heading, so posts get linkable section anchors. */
function headingId(node: TiptapNode): string | undefined {
  const text = (node.content ?? []).map((c) => c.text ?? "").join("");
  if (!text) return undefined;
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export default async function RenderTiptap({ doc }: { doc: TiptapDoc }) {
  return <>{await renderChildren(doc?.content)}</>;
}
