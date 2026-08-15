import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import PostArticle from "@/components/blog/PostArticle";
import BlogInteractions from "@/components/BlogInteractions";
import { getAllPostSlugs, getPostBySlug } from "@/lib/posts";
import { formatPostDate } from "@/lib/types";

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) return { title: "Post not found", robots: { index: false } };

  // Fall back to the site-wide OG card so a share always has an image.
  const images = post.coverImage ? [post.coverImage] : [`/blog/${slug}/opengraph-image`];

  return {
    // The root layout's template appends "| Sanket Nagare", so don't repeat it.
    title: post.title,
    description: post.description,
    keywords: post.tags,
    authors: [{ name: "Sanket Nagare", url: "https://sanketnagare.com" }],
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url: `/blog/${slug}`,
      publishedTime: post.publishedAt ?? undefined,
      modifiedTime: post.updatedAt,
      authors: ["Sanket Nagare"],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images,
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) notFound();

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://sanketnagare.com";
  const url = `${baseUrl}/blog/${slug}`;

  // BlogPosting markup is what makes a post eligible for Google's article rich
  // results (author, publish date, image in the SERP).
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    image: post.coverImage ? [post.coverImage] : [`${baseUrl}/blog/${slug}/opengraph-image`],
    datePublished: post.publishedAt ?? undefined,
    dateModified: post.updatedAt,
    keywords: post.tags?.join(", "),
    inLanguage: "en",
    author: {
      "@type": "Person",
      name: "Sanket Nagare",
      url: baseUrl,
    },
    publisher: {
      "@type": "Person",
      name: "Sanket Nagare",
      url: baseUrl,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Navbar />
      <PostArticle
        title={post.title}
        date={formatPostDate(post.publishedAt)}
        tags={post.tags}
        coverImage={post.coverImage}
        doc={post.content}
      >
        <BlogInteractions slug={slug} />
      </PostArticle>
    </>
  );
}
