import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Studio",
  // Keep the admin panel out of search results entirely.
  robots: { index: false, follow: false, nocache: true },
};

export default function StudioLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="min-h-screen bg-background">{children}</div>;
}
