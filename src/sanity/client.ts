import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-19'; // Use the latest valid API version
const token = process.env.SANITY_API_READ_TOKEN; // Read the server-side token

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset. Check your .env.local file.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  useCdn: false, // Disable CDN for webhook compatibility and fresh data
  token, // Include the API token for authenticated requests
  perspective: 'published', // Use 'published' for published content, 'previewDrafts' for drafts
  ignoreBrowserTokenWarning: true // Add this if using token in non-server environments (less relevant here but good practice)
});

// Helper function for generating image URLs with the asset reference
const builder = imageUrlBuilder(client);

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
  return client.fetch<QueryResponse>(query, params, {
    cache: process.env.NODE_ENV === 'development' ? 'no-store' : 'force-cache',
    next: { 
      tags,
      revalidate: process.env.NODE_ENV === 'development' ? false : revalidate
    },
  });
} 