import { defineQuery } from 'next-sanity'

/**
 * Homepage Queries
 * All queries related to the home page content
 */

// Main homepage query with all sections
export const homePageQuery = defineQuery(`*[_type == "homePage"][0] {
  _id,
  title,
  heroSection {
    title,
    vimeoUrl,
    backgroundImage {..., asset->}
  },
  definitionSection {
    titlePart1,
    titlePart2,
    definitionText,
    importantPointTitle,
    importantPointText,
    image1 {alt, asset->},
    image2 {alt, asset->}
  },
  featuredBlogPostSection {
    titlePart1,
    titlePart2,
    buttonText,
    image1 {alt, asset->},
    image2 {alt, asset->},
    featuredPost-> {
      _id,
      title,
      slug { current },
      excerpt,
      coverImage {alt, asset->}
    }
  },
  upcomingReleaseSection {
    reference-> {
      titlePart1,
      titlePart2,
      text,
      buttonText,
      buttonLink,
      image1 {alt, asset->},
      image2 {alt, asset->}
    },
    customButtonText,
    customButtonLink
  },
  newsletterSection-> {
    title,
    subtitle,
    placeholderText,
    buttonText
  },
  testimonialsSection {
    title,
    subtitle,
    testimonials[] {
      text,
      citation
    }
  }
}`)

// Query just for testimonials section (if needed separately)
export const testimonialsQuery = defineQuery(`*[_type == "homePage"][0] {
  testimonialsSection {
    title,
    subtitle,
    testimonials[] {
      text,
      citation
    }
  }
}`) 