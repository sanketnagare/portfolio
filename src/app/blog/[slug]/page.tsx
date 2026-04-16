import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { getPostBySlug, getAllPostSlugs } from "@/lib/posts";
import { MDXRemote } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import BlogInteractions from "@/components/BlogInteractions";

export async function generateStaticParams() {
  const slugs = getAllPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  try {
    const { meta } = getPostBySlug(slug);
    
    const images = meta.coverImage ? [meta.coverImage] : undefined;

    return {
      title: `${meta.title} - Sanket Nagare`,
      description: meta.description,
      keywords: meta.tags,
      openGraph: {
        title: meta.title,
        description: meta.description,
        type: 'article',
        publishedTime: meta.date ? new Date(meta.date).toISOString() : undefined,
        authors: ['Sanket Nagare'],
        images,
      },
      twitter: {
        card: "summary_large_image",
        title: meta.title,
        description: meta.description,
        images,
      },
    };
  } catch {
    return { title: "Post not found" };
  }
}

function BlogImage({ src, alt }: { src: string; alt: string }) {
  if (src.startsWith("http")) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className="rounded-lg max-w-full" />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={800}
      height={450}
      className="rounded-lg"
    />
  );
}

const components = {
  img: BlogImage,
  Image: BlogImage,
};

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const mdxOptions = {
    mdxOptions: {
      rehypePlugins: [rehypeHighlight],
    },
  };

  let post;
  try {
    post = getPostBySlug(slug);
  } catch {
    notFound();
  }

  const { meta, content } = post;

  return (
    <>
      <Navbar />
      <article className="max-w-3xl mx-auto px-6 pb-24 relative z-10">
        <header className="pt-28 pb-8">
          <Link
            href="/blog"
            className="text-xs text-foreground/40 hover:text-accent transition-colors mb-6 inline-block"
          >
            Back to blog
          </Link>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight mb-3">
            {meta.title}
          </h1>
          <div className="flex items-center gap-3 text-xs text-foreground/40">
            <span>{meta.date}</span>
            {meta.tags && meta.tags.length > 0 && (
              <>
                <span className="text-border">|</span>
                <div className="flex gap-2">
                  {meta.tags.map((tag: string) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </>
            )}
          </div>
        </header>

        {meta.coverImage && (
          <div className="mb-8">
            <BlogImage src={meta.coverImage} alt={meta.title} />
          </div>
        )}

        <div className="blog-prose">
          <MDXRemote 
            source={content} 
            components={components} 
            options={mdxOptions} 
          />
        </div>

        <BlogInteractions slug={slug} />
      </article>
    </>
  );
}
