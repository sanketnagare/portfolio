import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/posts";

export const alt = "Blog post by Sanket Nagare";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title = post?.title ?? "Sanket Nagare";
  const description = post?.description ?? "";
  const tags = post?.tags?.slice(0, 4) ?? [];
  const date = post?.publishedAt
    ? new Date(post.publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundImage:
            "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "72px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              fontSize: "22px",
              color: "#a5b4fc",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                color: "white",
                fontWeight: 700,
              }}
            >
              SN
            </div>
            sanketnagare.com / blog
          </div>

          <div
            style={{
              fontSize: title.length > 60 ? "58px" : "70px",
              fontWeight: 700,
              color: "white",
              lineHeight: 1.15,
              display: "flex",
            }}
          >
            {title}
          </div>

          {description && (
            <div
              style={{
                fontSize: "28px",
                color: "#94a3b8",
                lineHeight: 1.4,
                display: "flex",
              }}
            >
              {description.length > 130
                ? `${description.slice(0, 130)}...`
                : description}
            </div>
          )}
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            {tags.map((tag) => (
              <div
                key={tag}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: "rgba(99, 102, 241, 0.2)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  color: "#a5b4fc",
                  fontSize: "18px",
                }}
              >
                {tag}
              </div>
            ))}
          </div>

          <div style={{ fontSize: "20px", color: "#64748b", display: "flex" }}>
            {date && `${date} · `}Sanket Nagare
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
