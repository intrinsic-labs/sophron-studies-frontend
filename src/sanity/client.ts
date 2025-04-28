import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-15'; // Use a recent API version date
const token = process.env.SANITY_API_READ_TOKEN; // Read the server-side token

if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset. Check your .env.local file.');
}

export const client = createClient({
  projectId,
  dataset,
  apiVersion, 
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for faster responses
  token, // Include the API token for authenticated requests
  ignoreBrowserTokenWarning: true // Add this if using token in non-server environments (less relevant here but good practice)
});

// Helper function for generating image URLs with the asset reference
const builder = imageUrlBuilder(client);

export function urlFor(source: any) {
  return builder.image(source);
} 