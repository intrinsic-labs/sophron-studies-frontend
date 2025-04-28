import HeroSection from "@/components/HeroSection";
import NewsletterSection from "@/components/NewsletterSection";
import DefinitionOfSophron from "@/components/DefinitionOfSophron";
import FeaturedBlogPost from "@/components/FeaturedBlogPost";
import UpcomingRelease from "@/components/UpcomingRelease";

export default function Home() {
  return (
    <div>
      <HeroSection title="Sophron Studies" />

      <DefinitionOfSophron
        titlePart1="Definition of"
        titlePart2="Sophron"
        definitionText={
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut finibus ipsum lectus, posuere tincidunt arcu convallis non. Praesent id neque nec arcu pretium luctus. Sed consequat mauris eget pellentesque nascetur ridiculus mus.
          </p>
        }
        importantPointTitle="This is an Important Point"
        importantPointText={
          <>
            <p>
              Curabitur facilisis imperdiet lacus vulputate. Pellentesque placerat mauris id libero fermentum sodales. Mauris commodo ultricies imperdiet. Nam vitae nulla non nibh tincidunt maximus.
            </p>
            <p>
             Proin commodo ultrices lectus sagittis et. Sed consequat mauris eget placerat scelerisque.
            </p>
          </>
        }
        imageUrl1="/images/placeholder/flower01.jpeg" 
        imageUrl2="/images/placeholder/flower02.jpeg" 
        imageAlt="Placeholder flowers"
      />

      <FeaturedBlogPost
        titlePart1="Featured"
        titlePart2="Blog Post"
        text={
          <p>
            This is a short excerpt from said upcoming release or blog post that spans a few lines. Praesent id neque nec arcu pretium luctus. Sed consequat mauris eget pellentesque.
          </p>
        }
        imageUrl1="/images/placeholder/flower03.jpeg"
        imageUrl2="/images/placeholder/flower01.jpeg"
        imageUrl3="/images/placeholder/flower02.jpeg"
        imageAlt="Placeholder blog post images"
        buttonText="Read More"
        buttonLink="/blog/featured-post"
      />

      <UpcomingRelease
        titlePart1="Upcoming"
        titlePart2="Release"
        text={
          <p>
           This is a short excerpt from said upcoming release or blog post that spans a few lines. Praesent id neque nec arcu pretium luctus. Sed consequat mauris eget placerat scelerisque.
          </p>
        }
        imageUrl1="/images/placeholder/flower04.jpeg"
        imageUrl2="/images/placeholder/flower02.jpeg"
        imageAlt="Placeholder upcoming release images"
        buttonText="Read More"
        buttonLink="/shop/upcoming-release"
      />

      <NewsletterSection />
    </div>
  );
}
