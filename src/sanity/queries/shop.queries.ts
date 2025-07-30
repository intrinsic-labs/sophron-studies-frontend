import { defineQuery } from 'next-sanity'

/**
 * Shop & Product Queries
 * All queries related to products, categories, and shop functionality
 */

// Get all categories with product counts
export const categoriesQuery = defineQuery(`*[_type == "category"] {
  _id,
  title,
  slug,
  description,
  "productCount": count(*[_type == "product" && isAvailable == true && !(_id in path("drafts.**")) && references(^._id)])
} | order(title asc)`)

// Get paginated products with filters (basic query - will be built dynamically)
export const productsQuery = defineQuery(`*[_type == "product" && isAvailable == true && !(_id in path("drafts.**"))] | order(_createdAt desc) {
  _id,
  name,
  slug,
  images[]{..., asset->},
  price,
  externalUrl,
  categories[]->{_id, title, slug},
  sizes,
  _createdAt
}`)

// Get a single product by slug
export const productBySlugQuery = defineQuery(`*[
  _type == "product"
  && slug.current == $slug
][0]{
  _id,
  name,
  slug,
  images[]{..., asset->},
  description,
  price,
  externalUrl,
  isAvailable,
  categories[]->{_id, title, slug},
  sizes,
  _createdAt
}`)

// Get all product slugs for static generation
export const allProductSlugsQuery = defineQuery(`*[
  _type == "product"
  && defined(slug.current)
  && isAvailable == true
].slug.current`) 