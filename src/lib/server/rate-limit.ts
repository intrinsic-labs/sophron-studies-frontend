import { NextRequest } from 'next/server';

interface RateLimitBucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, RateLimitBucket>();

export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim() || 'unknown';
  }

  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }

  return 'unknown';
}

export function isRateLimited(key: string, maxRequests: number, windowMs: number): boolean {
  const now = Date.now();

  if (buckets.size > 10_000) {
    for (const [bucketKey, bucket] of buckets) {
      if (bucket.resetAt <= now) {
        buckets.delete(bucketKey);
      }
    }
  }

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, {
      count: 1,
      resetAt: now + windowMs,
    });
    return false;
  }

  if (existing.count >= maxRequests) {
    return true;
  }

  existing.count += 1;
  buckets.set(key, existing);
  return false;
}
