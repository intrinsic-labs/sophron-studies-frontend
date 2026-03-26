import 'server-only';

import { createClient } from '@sanity/client';
import type { SanityClient } from '@sanity/client';
import type { QueryParams } from '@sanity/client';

import { apiVersion } from './config';

let cachedClient: SanityClient | null = null;

function getServerSanityClient(): SanityClient {
  if (cachedClient) {
    return cachedClient;
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_READ_TOKEN;

  if (!projectId || !dataset) {
    throw new Error('Missing Sanity project configuration. Set NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET.');
  }

  cachedClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: token || undefined,
    perspective: 'published',
  });

  return cachedClient;
}

export const client = {
  fetch: async <QueryResult>(
    query: string,
    params: QueryParams = {},
    options?: {
      cache?: 'no-store' | 'force-cache';
      next?: {
        tags?: string[];
        revalidate?: number | false;
      };
    }
  ): Promise<QueryResult> => {
    return getServerSanityClient().fetch<QueryResult>(query, params, options);
  },
};

export async function sanityFetch<QueryResponse>({
  query,
  params = {},
  tags,
  revalidate = 300,
}: {
  query: string;
  params?: Record<string, unknown>;
  tags: string[];
  revalidate?: number | false;
}): Promise<QueryResponse> {
  const cacheConfig = process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' as const }
    : {
        cache: 'force-cache' as const,
        next: {
          tags,
          revalidate,
        },
      };

  return getServerSanityClient().fetch<QueryResponse>(query, params, cacheConfig);
}

export async function fetchSanity<QueryResult>(
  query: string,
  params: QueryParams = {},
  options: {
    revalidate?: number | false;
    tags?: string[];
  } = {}
): Promise<QueryResult> {
  const { revalidate = 300, tags = [] } = options;

  const cacheConfig = process.env.NODE_ENV === 'development'
    ? { cache: 'no-store' as const }
    : {
        cache: 'force-cache' as const,
        next: {
          tags,
          revalidate,
        },
      };

  return getServerSanityClient().fetch<QueryResult>(query, params, cacheConfig);
}
