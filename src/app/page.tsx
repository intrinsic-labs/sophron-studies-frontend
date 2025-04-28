import { client, urlFor } from "@/sanity/client";
import HeroSection from "@/components/HeroSection";
import NewsletterSection from "@/components/NewsletterSection";
import DefinitionOfSophron from "@/components/DefinitionOfSophron";
import FeaturedBlogPost from "@/components/FeaturedBlogPost";
import UpcomingRelease from "@/components/UpcomingRelease";
import { PortableText } from "@portabletext/react";
import Link from "next/link";

interface HomePageData {
  _id: string;
  title: string;
  heroSection: {
    title: string;
    backgroundImage?: { asset: any; alt: string };
  };
  definitionSection: {
    titlePart1: string;
    titlePart2: string;
    definitionText: any[];
    importantPointTitle: string;
    importantPointText: any[];
    image1: { asset: any; alt: string };
    image2: { asset: any; alt: string };
  };
  featuredBlogPostSection: {
    titlePart1: string;
    titlePart2: string;
    text: any[];
    buttonText: string;
    image1: { asset: any; alt: string };
    image2: { asset: any; alt: string };
    image3: { asset: any; alt: string };
    featuredPost: {
      _id: string;
      title: string;
      slug: { current: string };
    };
  };
  upcomingReleaseSection: {
    titlePart1: string;
    titlePart2: string;
    text: any[];
    buttonText: string;
    buttonLink: string;
    image1: { asset: any; alt: string };
    image2: { asset: any; alt: string };
  };
  newsletterSection: {
    title: string;
    subtitle: string;
    placeholderText: string;
    buttonText: string;
  };
}

const HOME_PAGE_QUERY = `*[_type == "homePage"][0] {
  _id,
  title,
  heroSection {
    title,
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
    text,
    buttonText,
    image1 {alt, asset->},
    image2 {alt, asset->},
    image3 {alt, asset->},
    featuredPost-> {
      _id,
      title,
      slug { current }
    }
  },
  upcomingReleaseSection {
    titlePart1,
    titlePart2,
    text,
    buttonText,
    buttonLink,
    image1 {alt, asset->},
    image2 {alt, asset->}
  },
  newsletterSection
}`;

async function getHomePageData(): Promise<HomePageData | null> {
  console.log('Sanity Client Config:', {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
    apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-15',
    useCdn: process.env.NODE_ENV === 'production'
  });

  try {
    const data = await client.fetch(HOME_PAGE_QUERY);
    console.log('Fetched Sanity Data:', JSON.stringify(data, null, 2));
    return data;
  } catch (error) {
    console.error('Error fetching Sanity data:', error);
    return null;
  }
}

export default async function Home() {
  console.log('Rendering Home page, attempting to fetch data...');
  const data = await getHomePageData();

  if (!data) {
    console.log('Home page received no data from getHomePageData.');
    return <div>Error loading page data. Please try again later.</div>;
  }

  console.log('Home page received data, rendering components...');

  const renderPortableText = (content: any[] | undefined) => {
    if (!content || content.length === 0) {
        return <p>Content not available.</p>;
    }
    return <PortableText value={content} />;
  };

  return (
    <div>
      {data.heroSection && (
         <HeroSection
           title={data.heroSection.title}
         />
      )}

      {data.definitionSection && (
        <DefinitionOfSophron
          titlePart1={data.definitionSection.titlePart1}
          titlePart2={data.definitionSection.titlePart2}
          definitionText={renderPortableText(data.definitionSection.definitionText)}
          importantPointTitle={data.definitionSection.importantPointTitle}
          importantPointText={renderPortableText(data.definitionSection.importantPointText)}
          imageUrl1={urlFor(data.definitionSection.image1.asset).width(500).url()}
          imageUrl2={urlFor(data.definitionSection.image2.asset).width(500).url()}
          imageAlt={data.definitionSection.image1.alt || data.definitionSection.image2.alt || 'Definition images'}
        />
      )}

      {data.featuredBlogPostSection && data.featuredBlogPostSection.featuredPost && (
        <FeaturedBlogPost
          titlePart1={data.featuredBlogPostSection.titlePart1}
          titlePart2={data.featuredBlogPostSection.titlePart2}
          text={renderPortableText(data.featuredBlogPostSection.text)}
          imageUrl1={urlFor(data.featuredBlogPostSection.image1.asset).width(400).url()}
          imageUrl2={urlFor(data.featuredBlogPostSection.image2.asset).width(400).url()}
          imageUrl3={urlFor(data.featuredBlogPostSection.image3.asset).width(300).url()}
          imageAlt={data.featuredBlogPostSection.image1.alt || 'Featured post collage'}
          buttonText={data.featuredBlogPostSection.buttonText}
          buttonLink={`/blog/${data.featuredBlogPostSection.featuredPost.slug.current}`}
        />
      )}

      {data.upcomingReleaseSection && (
        <UpcomingRelease
          titlePart1={data.upcomingReleaseSection.titlePart1}
          titlePart2={data.upcomingReleaseSection.titlePart2}
          text={renderPortableText(data.upcomingReleaseSection.text)}
          imageUrl1={urlFor(data.upcomingReleaseSection.image1.asset).width(400).url()}
          imageUrl2={urlFor(data.upcomingReleaseSection.image2.asset).width(400).url()}
          imageAlt={data.upcomingReleaseSection.image1.alt || 'Upcoming release images'}
          buttonText={data.upcomingReleaseSection.buttonText}
          buttonLink={data.upcomingReleaseSection.buttonLink}
        />
      )}

      {data.newsletterSection && (
        <NewsletterSection
          title={data.newsletterSection.title}
          subtitle={data.newsletterSection.subtitle}
        />
      )}
    </div>
  );
}
