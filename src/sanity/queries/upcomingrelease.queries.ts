import { defineQuery } from 'next-sanity'

/**
 * Upcoming Release Queries
 * All queries related to upcoming release sections
 */

// Get the most recently created upcoming release
export const latestUpcomingReleaseQuery = defineQuery(`*[_type == "upcomingReleaseSection"] | order(_createdAt desc)[0] {
  _id,
  status,
  backgroundTheme,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`)

// Get the upcomingReleaseSection that's currently referenced by the homepage
export const activeUpcomingReleaseQuery = defineQuery(`*[_type == "homePage"][0].upcomingReleaseSection.reference-> {
  _id,
  status,
  backgroundTheme,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`)

// Get both upcoming releases from the homepage
export const homePageUpcomingReleasesQuery = defineQuery(`*[_type == "homePage"][0].upcomingReleaseSection {
  showNewRelease,
  newRelease-> {
    _id,
    status,
    backgroundTheme,
    titlePart1,
    titlePart2,
    text,
    buttonText,
    buttonLink,
    image1 {asset->, alt},
    image2 {asset->, alt}
  },
  showComingSoon,
  comingSoon-> {
    _id,
    status,
    backgroundTheme,
    titlePart1,
    titlePart2,
    text,
    buttonText,
    buttonLink,
    image1 {asset->, alt},
    image2 {asset->, alt}
  }
}`)

// Get a specific upcoming release by ID
export const upcomingReleaseByIdQuery = defineQuery(`*[
  _type == "upcomingReleaseSection"
  && _id == $id
][0] {
  _id,
  status,
  backgroundTheme,
  titlePart1,
  titlePart2,
  text,
  buttonText,
  buttonLink,
  image1 {asset->, alt},
  image2 {asset->, alt}
}`) 