import { fetchSanity, urlFor } from "@/sanity/client";
import { homePageQuery } from "@/sanity/queries";
import type { HomePageQueryResult } from "@/sanity/types";
import HeroSection from "@/components/home/HeroSection";
import NewsletterSection from "@/components/sections/NewsletterSection";
import DefinitionOfSophron from "@/components/home/DefinitionOfSophron";
import FeaturedBlogPost from "@/components/sections/FeaturedBlogPost";
import UpcomingRelease from "@/components/sections/UpcomingRelease";
import TestimonialsSection from "@/components/sections/TestimonialsSection";
import { PortableText } from "@portabletext/react";

// Using generated types from @/sanity/types instead of manual interface

async function getHomePageData(): Promise<HomePageQueryResult | null> {
  console.log('🔍 Fetching Home Page data from Sanity...');
  
  try {
    const data = await fetchSanity<HomePageQueryResult>(
      homePageQuery,
      {},
      { 
        revalidate: 300,
        tags: ['homepage'] 
      }
    );
    
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

  // Helper functions to handle null coalescing
  const renderPortableText = (content: any) => {
    if (!content || (Array.isArray(content) && content.length === 0)) {
        return <p>Content not available.</p>;
    }
    return <PortableText value={content} />;
  };

  const safeString = (value: string | null | undefined): string => value || '';
  const safeImageUrl = (imageObj: any, width: number = 400): string => {
    return imageObj?.asset ? urlFor(imageObj.asset).width(width).url() : '';
  };
  const safeTestimonials = (testimonials: any[] | null | undefined) => {
    return (testimonials || []).map((t: any) => ({
      text: safeString(t?.text),
      citation: safeString(t?.citation)
    }));
  };

  return (
    <div>
      {data.heroSection && (
        <HeroSection
          vimeoUrl={data.heroSection.vimeoUrl || undefined}
          backgroundImage={data.heroSection.backgroundImage?.asset ? {
            url: urlFor(data.heroSection.backgroundImage.asset).width(1920).url(),
            alt: safeString(data.heroSection.backgroundImage.alt)
          } : undefined}
          overlayOpacity={0.4}
        />
      )}

      {data.definitionSection && (
        <DefinitionOfSophron
          titlePart1={safeString(data.definitionSection.titlePart1)}
          titlePart2={safeString(data.definitionSection.titlePart2)}
          definitionText={renderPortableText(data.definitionSection.definitionText)}
          importantPointTitle={safeString(data.definitionSection.importantPointTitle)}
          importantPointText={renderPortableText(data.definitionSection.importantPointText)}
          imageUrl1={safeImageUrl(data.definitionSection.image1, 500)}
          imageUrl2={safeImageUrl(data.definitionSection.image2, 500)}
          imageAlt={safeString(data.definitionSection.image1?.alt || data.definitionSection.image2?.alt) || 'Definition images'}
        />
      )}

      {data.featuredBlogPostSection && data.featuredBlogPostSection.featuredPost && (
        <FeaturedBlogPost
          titlePart1={safeString(data.featuredBlogPostSection.titlePart1)}
          titlePart2={safeString(data.featuredBlogPostSection.titlePart2)}
          text={safeString(data.featuredBlogPostSection.featuredPost.excerpt)}
          imageUrl1={safeImageUrl(data.featuredBlogPostSection.image1, 400)}
          imageUrl2={safeImageUrl(data.featuredBlogPostSection.image2, 400)}
          imageUrl3={safeImageUrl(data.featuredBlogPostSection.featuredPost.coverImage, 300)}
          imageAlt={safeString(data.featuredBlogPostSection.image1?.alt) || 'Featured post collage'}
          buttonText={safeString(data.featuredBlogPostSection.buttonText)}
          buttonLink={`/blog/${data.featuredBlogPostSection.featuredPost.slug?.current || ''}`}
        />
      )}

      {/* New Release Section */}
      {data.upcomingReleaseSection?.showNewRelease && data.upcomingReleaseSection?.newRelease && (
        <UpcomingRelease
          status={data.upcomingReleaseSection.newRelease.status || 'newRelease'}
          backgroundTheme={data.upcomingReleaseSection.newRelease.backgroundTheme || 'dark'}
          titlePart1={safeString(data.upcomingReleaseSection.newRelease.titlePart1)}
          titlePart2={safeString(data.upcomingReleaseSection.newRelease.titlePart2)}
          text={renderPortableText(data.upcomingReleaseSection.newRelease.text)}
          imageUrl1={safeImageUrl(data.upcomingReleaseSection.newRelease.image1, 400)}
          imageUrl2={safeImageUrl(data.upcomingReleaseSection.newRelease.image2, 400)}
          imageAlt={safeString(data.upcomingReleaseSection.newRelease.image1?.alt) || 'New release images'}
          buttonText={safeString(data.upcomingReleaseSection.newRelease.buttonText)}
          buttonLink={safeString(data.upcomingReleaseSection.newRelease.buttonLink)}
        />
      )}

      {/* Coming Soon Section */}
      {data.upcomingReleaseSection?.showComingSoon && data.upcomingReleaseSection?.comingSoon && (
        <div className={data.upcomingReleaseSection?.showNewRelease && data.upcomingReleaseSection?.newRelease ? "-mt-16 md:-mt-24" : ""}>
          <UpcomingRelease
            status={data.upcomingReleaseSection.comingSoon.status || 'comingSoon'}
            backgroundTheme={data.upcomingReleaseSection.comingSoon.backgroundTheme || 'dark'}
            titlePart1={safeString(data.upcomingReleaseSection.comingSoon.titlePart1)}
            titlePart2={safeString(data.upcomingReleaseSection.comingSoon.titlePart2)}
            text={renderPortableText(data.upcomingReleaseSection.comingSoon.text)}
            imageUrl1={safeImageUrl(data.upcomingReleaseSection.comingSoon.image1, 400)}
            imageUrl2={safeImageUrl(data.upcomingReleaseSection.comingSoon.image2, 400)}
            imageAlt={safeString(data.upcomingReleaseSection.comingSoon.image1?.alt) || 'Coming soon images'}
            buttonText={safeString(data.upcomingReleaseSection.comingSoon.buttonText)}
            buttonLink={safeString(data.upcomingReleaseSection.comingSoon.buttonLink)}
          />
        </div>
      )}

      {data.newsletterSection && (
        <NewsletterSection
          title={safeString(data.newsletterSection.title)}
          subtitle={safeString(data.newsletterSection.subtitle)}
          placeholderText={safeString(data.newsletterSection.placeholderText)}
          buttonText={safeString(data.newsletterSection.buttonText)}
          source="website.homepage"
        />
      )}

      {data.testimonialsSection && (
        <TestimonialsSection
          title={safeString(data.testimonialsSection.title)}
          subtitle={safeString(data.testimonialsSection.subtitle)}
          testimonials={safeTestimonials(data.testimonialsSection.testimonials)}
        />
      )}
    </div>
  );
}
