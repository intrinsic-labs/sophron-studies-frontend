import { fetchSanity, urlFor } from '@/sanity/client';
import { aboutPageQuery } from '@/sanity/queries';
import type { AboutPageQueryResult } from '@/sanity/types';
import AboutHero from '@/components/about/AboutHero';
import AboutBio from '@/components/about/AboutBio';
import AboutGallery from '@/components/about/AboutGallery';
import UpcomingRelease from '@/components/sections/UpcomingRelease';
import NewsletterSection from '@/components/sections/NewsletterSection';
import { PortableText } from '@portabletext/react';

// Using generated types from @/sanity/types instead of manual interface

async function getAboutPageData(): Promise<AboutPageQueryResult | null> {
  console.log('🔍 Fetching About Page data from Sanity...');
  
  try {
    const data = await fetchSanity<AboutPageQueryResult>(
      aboutPageQuery,
      {},
      {
        revalidate: 300,
        tags: ['aboutpage']
      }
    );
    
    console.log('✅ About Page data fetched successfully');
    console.log('📧 About Newsletter section data:', JSON.stringify(data?.newsletterSection, null, 2));
    console.log('ℹ️ About data structure:', {
      hasAboutHero: !!data?.aboutHeroSection,
      hasAboutBio: !!data?.aboutBioSection,
      hasAboutGallery: !!data?.aboutGallerySection,
      hasUpcomingRelease: !!data?.upcomingReleaseSection,
      hasNewsletterSection: !!data?.newsletterSection,
    });
    
    return data;
  } catch (error) {
    console.error('❌ Error fetching About page data:', error);
    return null;
  }
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  if (!data) {
    return <div>Error loading page data. Please try again later.</div>;
  }

  // Generate URLs using full image objects (preserves hotspot/crop data)
  const backgroundImageUrl = data.aboutHeroSection?.backgroundImage 
    ? urlFor(data.aboutHeroSection.backgroundImage).width(600).url() 
    : '';
    
  const rightImageUrl = data.aboutHeroSection?.rightImage 
    ? urlFor(data.aboutHeroSection.rightImage).width(400).url() 
    : '';
    
  const leftImageUrl = data.aboutHeroSection?.leftImage 
    ? urlFor(data.aboutHeroSection.leftImage).width(300).url() 
    : '';

  const galleryImages = data.aboutGallerySection?.images?.map(img => ({
    url: img ? urlFor(img).width(400).url() : '',
    alt: img?.alt || '',
  })) || [];

  const image1Url = data.upcomingReleaseSection?.reference?.image1 
    ? urlFor(data.upcomingReleaseSection.reference.image1).width(400).url() 
    : '';
    
  const image2Url = data.upcomingReleaseSection?.reference?.image2 
    ? urlFor(data.upcomingReleaseSection.reference.image2).width(400).url() 
    : '';

  const renderPortableText = (content: any) => {
    if (!content || (Array.isArray(content) && content.length === 0)) {
      return <p>Content not available.</p>;
    }
    return <PortableText value={content} />;
  };

  return (
    <div className="">
      {data.aboutHeroSection && (
        <AboutHero
          name={data.aboutHeroSection.name || ''}
          backgroundImage={backgroundImageUrl}
          rightImage={rightImageUrl}
          leftImage={leftImageUrl}
        />
      )}
      {data.aboutBioSection && data.aboutBioSection.heading && data.aboutBioSection.body && (
        <AboutBio
          heading={data.aboutBioSection.heading}
          body={data.aboutBioSection.body}
        />
      )}
      {data.aboutGallerySection && (
        <AboutGallery
          images={galleryImages}
        />
      )}
      {data.upcomingReleaseSection && data.upcomingReleaseSection.reference && (
        <UpcomingRelease
          titlePart1={data.upcomingReleaseSection.reference.titlePart1 || ''}
          titlePart2={data.upcomingReleaseSection.reference.titlePart2 || ''}
          text={renderPortableText(data.upcomingReleaseSection.reference.text)}
          imageUrl1={image1Url}
          imageUrl2={image2Url}
          imageAlt={data.upcomingReleaseSection.reference.image1?.alt || 'Upcoming release images'}
          buttonText={data.upcomingReleaseSection.customButtonText || data.upcomingReleaseSection.reference.buttonText || ''}
          buttonLink={data.upcomingReleaseSection.customButtonLink || data.upcomingReleaseSection.reference.buttonLink || ''}
        />
      )}
      {data.newsletterSection && (
        <NewsletterSection
          title={data.newsletterSection.title || ''}
          subtitle={data.newsletterSection.subtitle || ''}
          placeholderText={data.newsletterSection.placeholderText || ''}
          buttonText={data.newsletterSection.buttonText || ''}
          source="website.aboutpage"
        />
      )}
    </div>
  );
} 