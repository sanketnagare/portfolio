import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL 
  ? new URL(process.env.NEXT_PUBLIC_BASE_URL)
  : new URL('https://sanketnagare.com');

export const metadata: Metadata = {
  metadataBase: baseUrl,
  title: {
    default: "Sanket Nagare | Software Engineer",
    template: "%s | Sanket Nagare"
  },
  description: "Backend and AI engineer based in Pune. Currently building multi-agent systems and backend platforms at Kanaka Software.",
  keywords: [
    "Sanket Nagare",
    "Software Engineer",
    "Backend Engineer",
    "AI Engineer",
    "GenAI Engineer",
    "Kanaka Software",
    "Python",
    "Node.js",
    "Multi-Agent Systems",
    "LangChain",
    "RAG",
    "Pune"
  ],
  authors: [{ name: "Sanket Nagare", url: "https://sanketnagare.com" }],
  creator: "Sanket Nagare",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: baseUrl.href,
    title: "Sanket Nagare | Software Engineer",
    description: "Backend and AI engineer based in Pune. Currently building multi-agent systems and backend platforms.",
    siteName: "Sanket Nagare",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Sanket Nagare - Software Engineer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sanket Nagare | Software Engineer",
    description: "Backend and AI engineer based in Pune.",
    creator: "@sanketnagare",
    images: ["/opengraph-image"],
  },
  alternates: {
    canonical: baseUrl.href,
  },
};

const jsonLdPerson = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Sanket Nagare",
  url: baseUrl.href,
  jobTitle: "Software Engineer",
  description: "Backend and AI engineer based in Pune. Currently building multi-agent systems and backend platforms at Kanaka Software.",
  image: `${baseUrl.href}photo.jpeg`,
  email: "sanket.nagare.work@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Pune",
    addressCountry: "IN",
  },
  sameAs: [
    "https://github.com/sanketnagare",
    "https://linkedin.com/in/sanket-nagare",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Kanaka Software",
  },
  knowsAbout: [
    "Python", "Node.js", "Multi-Agent Systems", "LangChain",
    "RAG", "FastAPI", "AWS", "Docker", "GenAI"
  ],
};

const jsonLdWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sanket Nagare",
  url: baseUrl.href,
  description: "Backend and AI engineer based in Pune. Currently building multi-agent systems and backend platforms at Kanaka Software.",
  author: {
    "@type": "Person",
    name: "Sanket Nagare",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.png" />
        <link rel="canonical" href={baseUrl.href} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPerson) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
