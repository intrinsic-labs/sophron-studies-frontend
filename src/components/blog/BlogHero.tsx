import { fetchSanity } from '@/sanity/client';
import { blogHeroQuery } from '@/sanity/queries';
import type { BlogHeroQueryResult } from '@/sanity/types';
import PageHero from './PageHero';

async function getBlogHeroData(): Promise<BlogHeroQueryResult | null> {
  try {
    const data = await fetchSanity<BlogHeroQueryResult>(
      blogHeroQuery,
      {},
      { 
        revalidate: 300,
        tags: ['blog-hero'] 
      }
    );
    return data;
  } catch (error) {
    console.error('Error fetching blog hero data:', error);
    return null;
  }
}

const BlogHero = async () => {
  const heroData = await getBlogHeroData();

  // Default content if nothing is in the CMS yet
  const title = heroData?.title || "The Sophron Blog";
  const description = heroData?.description || "With Melissa McPhail";

  return (
    <div className="flex flex-col gap-4 mx-4">
      <PageHero
        title={title}
        description={description}
        bottomPadding={false}
      />
      {heroData?.announcement && heroData?.announcementLink && (
        <a 
          href={heroData.announcementLink} 
          target="_blank"
          rel="noopener noreferrer"
          className="text-lg bg-orange text-white hover:bg-white hover:text-orange border border-orange transition-colors duration-300 px-3 py-1 flex justify-center text-center rounded-md max-w-max mx-auto"
        >
          {heroData.announcement}
        </a>
      )}
    </div>
  );
};

export default BlogHero; 