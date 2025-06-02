import { client, urlFor } from "@/sanity/client";
import HeroSection from "@/components/HeroSection";
import NewsletterSection from "@/components/NewsletterSection";
import DefinitionOfSophron from "@/components/DefinitionOfSophron";
import FeaturedBlogPost from "@/components/FeaturedBlogPost";
import UpcomingRelease from "@/components/UpcomingRelease";
import { PortableText } from "@portabletext/react";

interface HomePageData {
  _id: string;
  title: string;
  heroSection: {
    title: string;
    vimeoUrl?: string;
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
    buttonText: string;
    image1: { asset: any; alt: string };
    image2: { asset: any; alt: string };
    featuredPost: {
      _id: string;
      title: string;
      slug: { current: string };
      excerpt: string;
      coverImage: { asset: any; alt: string };
    };
  };
  upcomingReleaseSection: {
    reference: {
      titlePart1: string;
      titlePart2: string;
      text: any[];
      buttonText: string;
      buttonLink: string;
      image1: { asset: any; alt: string };
      image2: { asset: any; alt: string };
    };
    customButtonText?: string;
    customButtonLink?: string;
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
  }
}`;

async function getHomePageData(): Promise<HomePageData | null> {
  console.log('🔍 Fetching Home Page data from Sanity...');

  try {
    const data = await client.fetch(HOME_PAGE_QUERY, {}, { next: { revalidate: 300 } }); // 5 minutes
    
    console.log('✅ Home Page data fetched successfully');
    console.log('📧 Newsletter section data:', JSON.stringify(data?.newsletterSection, null, 2));
    console.log('📝 Featured blog section data:', JSON.stringify(data?.featuredBlogPostSection, null, 2));
    console.log('🏠 Full data structure:', {
      hasHeroSection: !!data?.heroSection,
      hasDefinitionSection: !!data?.definitionSection,
      hasFeaturedBlogSection: !!data?.featuredBlogPostSection,
      hasUpcomingRelease: !!data?.upcomingReleaseSection,
      hasNewsletterSection: !!data?.newsletterSection,
      newsletterFields: data?.newsletterSection ? Object.keys(data.newsletterSection) : [],
      featuredPostFields: data?.featuredBlogPostSection?.featuredPost ? Object.keys(data.featuredBlogPostSection.featuredPost) : []
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching Sanity data:', error);
    return null;
  }
}

export default async function Home() {
  console.log('🏠 Rendering Home page, attempting to fetch data...');
  const data = await getHomePageData();

  if (!data) {
    console.log('❌ Home page received no data from getHomePageData.');
    return <div>Error loading page data. Please try again later.</div>;
  }

  console.log('🎉 Home page received data, rendering components...');

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
           vimeoUrl={data.heroSection.vimeoUrl}
           backgroundImage={data.heroSection.backgroundImage ? {
             url: urlFor(data.heroSection.backgroundImage.asset).width(1920).url(),
             alt: data.heroSection.backgroundImage.alt
           } : undefined}
           overlayOpacity={0.4}
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
          text={data.featuredBlogPostSection.featuredPost.excerpt}
          imageUrl1={urlFor(data.featuredBlogPostSection.image1.asset).width(400).url()}
          imageUrl2={urlFor(data.featuredBlogPostSection.image2.asset).width(400).url()}
          imageUrl3={urlFor(data.featuredBlogPostSection.featuredPost.coverImage.asset).width(300).url()}
          imageAlt={data.featuredBlogPostSection.image1.alt || 'Featured post collage'}
          buttonText={data.featuredBlogPostSection.buttonText}
          buttonLink={`/blog/${data.featuredBlogPostSection.featuredPost.slug.current}`}
        />
      )}

      {data.upcomingReleaseSection && data.upcomingReleaseSection.reference && (
        <UpcomingRelease
          titlePart1={data.upcomingReleaseSection.reference.titlePart1}
          titlePart2={data.upcomingReleaseSection.reference.titlePart2}
          text={renderPortableText(data.upcomingReleaseSection.reference.text)}
          imageUrl1={urlFor(data.upcomingReleaseSection.reference.image1.asset).width(400).url()}
          imageUrl2={urlFor(data.upcomingReleaseSection.reference.image2.asset).width(400).url()}
          imageAlt={data.upcomingReleaseSection.reference.image1.alt || 'Upcoming release images'}
          buttonText={data.upcomingReleaseSection.customButtonText || data.upcomingReleaseSection.reference.buttonText}
          buttonLink={data.upcomingReleaseSection.customButtonLink || data.upcomingReleaseSection.reference.buttonLink}
        />
      )}

      {data.newsletterSection && (
        <NewsletterSection
          title={data.newsletterSection.title}
          subtitle={data.newsletterSection.subtitle}
          placeholderText={data.newsletterSection.placeholderText}
          buttonText={data.newsletterSection.buttonText}
        />
      )}
    </div>
  );
}
