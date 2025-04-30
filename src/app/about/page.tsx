import { client, urlFor } from '@/sanity/client';
import AboutHero from '@/components/AboutHero';
import AboutBio from '@/components/AboutBio';
import AboutGallery from '@/components/AboutGallery';
import UpcomingRelease from '@/components/UpcomingRelease';
import NewsletterSection from '@/components/NewsletterSection';
import { PortableText } from '@portabletext/react';

interface AboutPageData {
  _id: string;
  title: string;
  aboutHeroSection: {
    name: string;
    backgroundImage?: { asset: any };
    rightImage?: { asset: any };
    leftImage?: { asset: any };
  };
  aboutBioSection: {
    heading: string;
    body: any[];
  };
  aboutGallerySection: {
    images: { asset: any; alt: string }[];
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
  };
}

const ABOUT_PAGE_QUERY = `*[_type == "aboutPage"][0] {
  _id,
  title,
  aboutHeroSection {
    name,
    backgroundImage {asset->},
    rightImage {asset->},
    leftImage {asset->}
  },
  aboutBioSection {
    heading,
    body
  },
  aboutGallerySection {
    images[]{asset->, alt}
  },
  upcomingReleaseSection {
    titlePart1,
    titlePart2,
    text,
    buttonText,
    buttonLink,
    image1 {asset->, alt},
    image2 {asset->, alt}
  },
  newsletterSection
}`;

async function getAboutPageData(): Promise<AboutPageData | null> {
  try {
    const data = await client.fetch(ABOUT_PAGE_QUERY);
    return data;
  } catch (error) {
    console.error('Error fetching About page data:', error);
    return null;
  }
}

export default async function AboutPage() {
  const data = await getAboutPageData();
  if (!data) {
    return <div>Error loading page data. Please try again later.</div>;
  }

  const renderPortableText = (content: any[] | undefined) => {
    if (!content || content.length === 0) {
      return <p>Content not available.</p>;
    }
    return <PortableText value={content} />;
  };

  return (
    <div className="space-y-16 md:space-y-24">
      {data.aboutHeroSection && (
        <AboutHero
          name={data.aboutHeroSection.name}
          backgroundImage={data.aboutHeroSection.backgroundImage?.asset ? urlFor(data.aboutHeroSection.backgroundImage.asset).width(600).url() : undefined}
          rightImage={data.aboutHeroSection.rightImage?.asset ? urlFor(data.aboutHeroSection.rightImage.asset).width(400).url() : undefined}
          leftImage={data.aboutHeroSection.leftImage?.asset ? urlFor(data.aboutHeroSection.leftImage.asset).width(300).url() : undefined}
        />
      )}
      {data.aboutBioSection && (
        <AboutBio
          heading={data.aboutBioSection.heading}
          body={data.aboutBioSection.body}
        />
      )}
      {data.aboutGallerySection && (
        <AboutGallery
          images={data.aboutGallerySection.images?.map(img => ({
            url: img.asset ? urlFor(img.asset).width(400).url() : undefined,
            alt: img.alt || '',
          })) || []}
        />
      )}
      {data.upcomingReleaseSection && (
        <UpcomingRelease
          titlePart1={data.upcomingReleaseSection.titlePart1}
          titlePart2={data.upcomingReleaseSection.titlePart2}
          text={renderPortableText(data.upcomingReleaseSection.text)}
          imageUrl1={data.upcomingReleaseSection.image1?.asset ? urlFor(data.upcomingReleaseSection.image1.asset).width(400).url() : ''}
          imageUrl2={data.upcomingReleaseSection.image2?.asset ? urlFor(data.upcomingReleaseSection.image2.asset).width(400).url() : ''}
          imageAlt={data.upcomingReleaseSection.image1?.alt || 'Upcoming release images'}
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