import { defineQuery } from 'next-sanity'

/**
 * About Page Queries
 * All queries related to the about page content
 */

// Main about page query with all sections
export const aboutPageQuery = defineQuery(`*[_type == "aboutPage"][0] {
  _id,
  title,
  aboutHeroSection {
    name,
    backgroundImage,
    rightImage,
    leftImage
  },
  aboutBioSection {
    heading,
    body
  },
  aboutGallerySection {
    images[]
  },
  upcomingReleaseSection {
    reference-> {
      titlePart1,
      titlePart2,
      text,
      buttonText,
      buttonLink,
      image1,
      image2
    },
    customButtonText,
    customButtonLink
  },
  newsletterSection-> {
    title,
    subtitle,
    placeholderText,
    buttonText
  }
}`) 