import { defineQuery } from 'next-sanity'

/**
 * Upcoming Release Queries
 * All queries related to upcoming release sections
 */

// Get the most recently created upcoming release
export const latestUpcomingReleaseQuery = defineQuery(`*[_type == "upcomingReleaseSection"] | order(_createdAt desc)[0] {
  _id,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`)

// Get a specific upcoming release by ID
export const upcomingReleaseByIdQuery = defineQuery(`*[
  _type == "upcomingReleaseSection"
  && _id == $id
][0] {
  _id,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`) 