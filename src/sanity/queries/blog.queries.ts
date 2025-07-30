import { defineQuery } from 'next-sanity'

/**
 * Blog Queries
 * All queries related to blog posts, authors, and blog content
 */

// Base post fields that are reused across queries
const postFields = `
  _id,
  title,
  excerpt,
  content,
  "slug": slug.current,
  coverImage,
  "author": {
    "name": author->name,
    "avatar": author->avatar
  },
  publishedAt,
  readingTime,
  category,
  tags,
  featured
`

// Get all blog posts
export const allBlogPostsQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc){
  ${postFields}
}`)

// Get featured blog posts
export const featuredBlogPostsQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && featured == true
]|order(publishedAt desc){
  ${postFields}
}`)

// Get a single blog post by slug
export const blogPostBySlugQuery = defineQuery(`*[
  _type == "post"
  && slug.current == $slug
][0]{
  ${postFields}
}`)

// Get related blog posts (by category and tags, excluding current post)
export const relatedPostsQuery = defineQuery(`*[
  _type == "post"
  && slug.current != $slug
  && (category == $category || count((tags)[@ in $tags]) > 0)
]|order(publishedAt desc)[0...3]{
  ${postFields}
}`)

// Get recent posts to fill in related posts if needed
export const recentPostsQuery = defineQuery(`*[
  _type == "post"
  && slug.current != $slug
  && !(_id in $existingIds)
]|order(publishedAt desc)[0...3]{
  ${postFields}
}`)

// Get blog posts by category
export const blogPostsByCategoryQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && category == $category
]|order(publishedAt desc){
  ${postFields}
}`)

// Get blog posts by tag
export const blogPostsByTagQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && $tagName in tags
]|order(publishedAt desc){
  ${postFields}
}`)

// Search blog posts
export const searchBlogPostsQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
  && (
    title match $searchPattern ||
    excerpt match $searchPattern ||
    content match $searchPattern ||
    category match $searchPattern
  )
]|order(publishedAt desc){
  ${postFields}
}`)

// Get all categories
export const allCategoriesQuery = defineQuery(`array::unique(*[
  _type == "post" 
  && defined(category)
].category)`)

// Get all tags
export const allTagsQuery = defineQuery(`array::unique(*[
  _type == "post" 
  && defined(tags)
].tags[])`)

// Get blog hero data
export const blogHeroQuery = defineQuery(`*[_type == "blogHero"][0]{
  title,
  description,
  announcement,
  announcementLink
}`)

// Get all post slugs for static generation
export const allPostSlugsQuery = defineQuery(`*[
  _type == "post"
  && defined(slug.current)
].slug.current`) 