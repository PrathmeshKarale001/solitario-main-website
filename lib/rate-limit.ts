// Rate limiting utility for API endpoints
// Audit Recommendation: 4.1 - Add Rate Limiting

// In-memory rate limiter (for serverless, use Upstash Redis in production)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  maxRequests: number;  // Max requests per window
}

// Default configurations for different endpoint types
export const RATE_LIMIT_CONFIGS = {
  // Strict limit for sensitive endpoints
  payment: { windowMs: 60000, maxRequests: 5 },
  // Moderate limit for auth endpoints
  auth: { windowMs: 60000, maxRequests: 10 },
  // Standard limit for API endpoints
  api: { windowMs: 60000, maxRequests: 60 },
  // Relaxed limit for public endpoints
  public: { windowMs: 60000, maxRequests: 100 },
} as const;

export interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetIn: number;
  limit: number;
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Unique identifier (e.g., IP address, user ID)
 * @param config - Rate limit configuration
 * @returns Rate limit result with success status and metadata
 */
export function checkRateLimit(
  identifier: string,
  config: RateLimitConfig = RATE_LIMIT_CONFIGS.api
): RateLimitResult {
  const now = Date.now();
  const key = identifier;
  const record = rateLimitMap.get(key);

  // Clean up expired entries periodically
  if (Math.random() < 0.01) {
    cleanupExpiredEntries();
  }

  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return {
      success: true,
      remaining: config.maxRequests - 1,
      resetIn: config.windowMs,
      limit: config.maxRequests,
    };
  }

  if (record.count >= config.maxRequests) {
    // Rate limit exceeded
    return {
      success: false,
      remaining: 0,
      resetIn: record.resetTime - now,
      limit: config.maxRequests,
    };
  }

  // Increment counter
  record.count++;
  return {
    success: true,
    remaining: config.maxRequests - record.count,
    resetIn: record.resetTime - now,
    limit: config.maxRequests,
  };
}

/**
 * Clean up expired rate limit entries
 */
function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key);
    }
  }
}

/**
 * Get client identifier from request headers
 * Uses X-Forwarded-For for proxied requests, falls back to a default
 */
export function getClientIdentifier(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback for development
  return 'unknown-client';
}

/**
 * Rate limit middleware for API routes
 * Returns headers to include in response
 */
export function getRateLimitHeaders(result: RateLimitResult): Record<string, string> {
  return {
    'X-RateLimit-Limit': result.limit.toString(),
    'X-RateLimit-Remaining': result.remaining.toString(),
    'X-RateLimit-Reset': Math.ceil(result.resetIn / 1000).toString(),
  };
}

/**
 * Create a rate limiter for specific endpoint
 */
export function createRateLimiter(config: RateLimitConfig) {
  return {
    check: (identifier: string) => checkRateLimit(identifier, config),
    getHeaders: getRateLimitHeaders,
  };
}

// Export pre-configured limiters
export const paymentRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.payment);
export const authRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.auth);
export const apiRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.api);
export const publicRateLimiter = createRateLimiter(RATE_LIMIT_CONFIGS.public);
