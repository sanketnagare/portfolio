import { ImageResponse } from "next/og";

export const alt = "Sanket Nagare - Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)",
          padding: "80px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "40px",
          }}
        >
          <div
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "20px",
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "72px",
              color: "white",
              fontWeight: 700,
            }}
          >
            SN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <h1
              style={{
                fontSize: "64px",
                fontWeight: 700,
                color: "white",
                margin: 0,
                lineHeight: 1.1,
              }}
            >
              Sanket Nagare
            </h1>
            <p
              style={{
                fontSize: "28px",
                color: "#94a3b8",
                margin: 0,
                lineHeight: 1.4,
              }}
            >
              Software Engineer — Backend & AI
            </p>
            <p
              style={{
                fontSize: "20px",
                color: "#64748b",
                margin: 0,
                marginTop: "4px",
              }}
            >
              Pune, India · sanketnagare.com
            </p>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          {["Python", "Node.js", "Multi-Agent Systems", "LangChain", "RAG", "FastAPI"].map(
            (skill) => (
              <div
                key={skill}
                style={{
                  padding: "8px 20px",
                  borderRadius: "9999px",
                  background: "rgba(99, 102, 241, 0.2)",
                  border: "1px solid rgba(99, 102, 241, 0.4)",
                  color: "#a5b4fc",
                  fontSize: "18px",
                }}
              >
                {skill}
              </div>
            )
          )}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
