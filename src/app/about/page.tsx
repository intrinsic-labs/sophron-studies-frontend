import { fetchSanity, urlFor } from '@/sanity/client';
import { aboutPageQuery } from '@/sanity/queries';
import type { AboutPageQueryResult } from '@/sanity/types';
import AboutHero from '@/components/about/AboutHero';
import AboutBio from '@/components/about/AboutBio';
import AboutGallery from '@/components/about/AboutGallery';
import NewsletterSection from '@/components/sections/NewsletterSection';

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
  const backgroundImageUrl = data.aboutHeroSection?.backgroundImage?.asset 
    ? urlFor(data.aboutHeroSection.backgroundImage.asset).width(1920).url() 
    : '';
  const rightImageUrl = data.aboutHeroSection?.rightImage?.asset 
    ? urlFor(data.aboutHeroSection.rightImage.asset).width(600).url() 
    : '';
  const leftImageUrl = data.aboutHeroSection?.leftImage?.asset 
    ? urlFor(data.aboutHeroSection.leftImage.asset).width(600).url() 
    : '';

  // Process gallery images
  const galleryImages = data.aboutGallerySection?.images?.map(image => ({
    url: image.asset ? urlFor(image.asset).width(800).url() : '',
    alt: image.alt || 'Gallery image',
  })) || [];

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