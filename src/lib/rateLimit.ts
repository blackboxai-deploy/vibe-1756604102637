interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

// Simple in-memory rate limiting store
// In production, use Redis or database
const rateLimitStore: RateLimitStore = {};

export function checkRateLimit(
  identifier: string,
  limit: number = 100,
  windowMs: number = 60000
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now();
  const key = identifier;

  // Clean up expired entries
  if (rateLimitStore[key] && now > rateLimitStore[key].resetTime) {
    delete rateLimitStore[key];
  }

  // Initialize if not exists
  if (!rateLimitStore[key]) {
    rateLimitStore[key] = {
      count: 0,
      resetTime: now + windowMs
    };
  }

  const entry = rateLimitStore[key];
  
  // Check if limit exceeded
  if (entry.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    };
  }

  // Increment count
  entry.count++;

  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  };
}

// Clean up expired entries periodically
export function cleanRateLimitStore(): void {
  const now = Date.now();
  for (const key in rateLimitStore) {
    if (now > rateLimitStore[key].resetTime) {
      delete rateLimitStore[key];
    }
  }
}

// Setup periodic cleanup (run every 5 minutes)
if (typeof setInterval !== 'undefined') {
  setInterval(cleanRateLimitStore, 5 * 60 * 1000);
}