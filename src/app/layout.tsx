import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sanket - Portfolio",
  description: "Creative developer crafting digital experiences with code and design.",
  keywords: ["developer", "portfolio", "creative", "web development", "design"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
