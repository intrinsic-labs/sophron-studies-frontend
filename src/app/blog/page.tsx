import { type SanityDocument } from "next-sanity";
import { client } from "@/sanity/client";
import BlogPageContent from '@/components/blog/BlogPageContent';

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt, coverImage}`;

const options = { next: { revalidate: 30 } };

export default async function BlogPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return <BlogPageContent posts={posts} />;
} 