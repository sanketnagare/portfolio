/**
 * One-off migration: turns the file-based MDX posts in content/blog into rows
 * in the Supabase `posts` table.
 *
 * Run from the project root:  node scripts/migrate-mdx-to-db.mjs
 * Safe to re-run -- it upserts on slug.
 */
import fs from "node:fs";
import path from "node:path";
import nextEnv from "@next/env";
import matter from "gray-matter";
import { marked } from "marked";
import { createClient } from "@supabase/supabase-js";

nextEnv.loadEnvConfig(process.cwd(), true, { info: () => {}, error: console.error });

const POSTS_DIR = path.join(process.cwd(), "content/blog");

const ENTITIES = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#x27;": "'",
  "&nbsp;": " ",
};

const decode = (s = "") =>
  s.replace(/&(amp|lt|gt|quot|#39|#x27|nbsp);/g, (m) => ENTITIES[m] ?? m);

/** Inline markdown tokens -> Tiptap text nodes with marks. */
function inline(tokens = [], marks = []) {
  const out = [];

  for (const t of tokens) {
    switch (t.type) {
      case "strong":
        out.push(...inline(t.tokens, [...marks, { type: "bold" }]));
        break;
      case "em":
        out.push(...inline(t.tokens, [...marks, { type: "italic" }]));
        break;
      case "del":
        out.push(...inline(t.tokens, [...marks, { type: "strike" }]));
        break;
      case "codespan":
        out.push({
          type: "text",
          text: decode(t.text),
          marks: [...marks, { type: "code" }],
        });
        break;
      case "link":
        out.push(
          ...inline(t.tokens, [
            ...marks,
            { type: "link", attrs: { href: t.href, target: "_blank" } },
          ])
        );
        break;
      case "br":
        out.push({ type: "hardBreak" });
        break;
      case "escape":
      case "text": {
        if (t.tokens?.length) {
          out.push(...inline(t.tokens, marks));
        } else {
          const text = decode(t.text);
          if (text) out.push(marks.length ? { type: "text", text, marks } : { type: "text", text });
        }
        break;
      }
      default:
        if (t.tokens?.length) out.push(...inline(t.tokens, marks));
        else if (t.text) out.push({ type: "text", text: decode(t.text) });
    }
  }

  return out;
}

/** Block markdown tokens -> Tiptap block nodes. */
function blocks(tokens = []) {
  const out = [];

  for (const t of tokens) {
    switch (t.type) {
      case "heading":
        out.push({
          // The post title is the h1, so headings start at h2.
          type: "heading",
          attrs: { level: Math.min(Math.max(t.depth, 2), 4) },
          content: inline(t.tokens),
        });
        break;

      case "paragraph": {
        const content = inline(t.tokens);
        out.push(content.length ? { type: "paragraph", content } : { type: "paragraph" });
        break;
      }

      case "code":
        out.push({
          type: "codeBlock",
          attrs: { language: t.lang || null },
          content: [{ type: "text", text: t.text }],
        });
        break;

      case "list":
        out.push({
          type: t.ordered ? "orderedList" : "bulletList",
          content: t.items.map((item) => ({
            type: "listItem",
            content: blocks(item.tokens).length
              ? blocks(item.tokens)
              : [{ type: "paragraph", content: inline(item.tokens) }],
          })),
        });
        break;

      case "blockquote":
        out.push({ type: "blockquote", content: blocks(t.tokens) });
        break;

      case "hr":
        out.push({ type: "horizontalRule" });
        break;

      case "space":
        break;

      case "text":
        out.push({ type: "paragraph", content: inline(t.tokens ?? [t]) });
        break;

      default:
        console.warn(`  ! skipped unsupported token: ${t.type}`);
    }
  }

  return out;
}

function markdownToDoc(markdown) {
  return { type: "doc", content: blocks(marked.lexer(markdown)) };
}

async function main() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Missing Supabase env vars.");

  const supabase = createClient(url, key, { auth: { persistSession: false } });

  if (!fs.existsSync(POSTS_DIR)) {
    console.log("No content/blog directory. Nothing to migrate.");
    return;
  }

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));
  if (files.length === 0) {
    console.log("No .mdx files found.");
    return;
  }

  for (const file of files) {
    const slug = file.replace(/\.mdx$/, "");
    const { data: fm, content } = matter(
      fs.readFileSync(path.join(POSTS_DIR, file), "utf8")
    );

    const doc = markdownToDoc(content);

    const row = {
      slug,
      title: fm.title || slug,
      description: fm.description || "",
      cover_image: fm.coverImage || null,
      tags: fm.tags || [],
      content: doc,
      status: "published",
      published_at: fm.date ? new Date(fm.date).toISOString() : new Date().toISOString(),
    };

    const { error } = await supabase.from("posts").upsert(row, { onConflict: "slug" });

    if (error) console.error(`  FAILED ${slug}: ${error.message}`);
    else console.log(`  migrated ${slug} (${doc.content.length} blocks)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
