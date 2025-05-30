import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

if (!projectId || !dataset || !apiVersion) {
  throw new Error("Missing Sanity environment variables. Check your .env.local file.");
}

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion, // https://www.sanity.io/docs/api-versioning
  useCdn: false, // Disable CDN for webhook compatibility
});

// Helper function for generating Image URLs with only the asset reference data in your documents.
// Read more: https://www.sanity.io/docs/image-url
const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}

// Enhanced fetch function with cache tags for revalidation
export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate = 300, // Default 5 minutes
}: {
  query: string;
  params?: Record<string, any>;
  tags: string[];
  revalidate?: number | false;
}): Promise<QueryResponse> {
  return sanityClient.fetch<QueryResponse>(query, params, {
    cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
    next: { 
      tags,
      revalidate: process.env.NODE_ENV === 'development' ? false : revalidate
    },
  });
} 