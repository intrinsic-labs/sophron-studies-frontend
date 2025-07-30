import { defineQuery } from 'next-sanity'

/**
 * Newsletter Queries
 * All queries related to newsletter configuration
 */

// Get newsletter section configuration
export const newsletterSectionQuery = defineQuery(`*[_type == "newsletterSection"][0] {
  title,
  subtitle,
  placeholderText,
  buttonText
}`) 