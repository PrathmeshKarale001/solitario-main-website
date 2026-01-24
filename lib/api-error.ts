// Standardized API Error class for consistent error responses
// Audit Recommendation: 2.1 - Standardize Error Responses

export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR',
    public details?: Record<string, any>
  ) {
    super(message);
    this.name = 'APIError';
    
    // Maintains proper stack trace for where error was thrown
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, APIError);
    }
  }

  toJSON() {
    return {
      error: {
        message: this.message,
        code: this.code,
        statusCode: this.statusCode,
        ...(this.details && { details: this.details }),
      },
    };
  }

  static badRequest(message: string, code: string = 'BAD_REQUEST', details?: Record<string, any>) {
    return new APIError(message, 400, code, details);
  }

  static unauthorized(message: string = 'Unauthorized', code: string = 'UNAUTHORIZED') {
    return new APIError(message, 401, code);
  }

  static forbidden(message: string = 'Forbidden', code: string = 'FORBIDDEN') {
    return new APIError(message, 403, code);
  }

  static notFound(message: string = 'Not found', code: string = 'NOT_FOUND') {
    return new APIError(message, 404, code);
  }

  static conflict(message: string, code: string = 'CONFLICT') {
    return new APIError(message, 409, code);
  }

  static tooManyRequests(message: string = 'Too many requests', code: string = 'RATE_LIMITED') {
    return new APIError(message, 429, code);
  }

  static internal(message: string = 'Internal server error', code: string = 'INTERNAL_ERROR') {
    return new APIError(message, 500, code);
  }

  static serviceUnavailable(message: string = 'Service unavailable', code: string = 'SERVICE_UNAVAILABLE') {
    return new APIError(message, 503, code);
  }
}

// Retry utility with exponential backoff
// Audit Recommendation: 2.1 - Implement Retry Logic
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    baseDelayMs?: number;
    maxDelayMs?: number;
    shouldRetry?: (error: any) => boolean;
    onRetry?: (error: any, attempt: number) => void;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelayMs = 1000,
    maxDelayMs = 10000,
    shouldRetry = () => true,
    onRetry,
  } = options;

  let lastError: any;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;

      if (attempt === maxRetries || !shouldRetry(error)) {
        throw error;
      }

      // Calculate delay with exponential backoff and jitter
      const delay = Math.min(
        baseDelayMs * Math.pow(2, attempt) + Math.random() * 1000,
        maxDelayMs
      );

      if (onRetry) {
        onRetry(error, attempt + 1);
      }

      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError;
}

// Helper to check if error is retryable
export function isRetryableError(error: any): boolean {
  // Retry on network errors
  if (error.name === 'TypeError' && error.message.includes('fetch')) {
    return true;
  }

  // Retry on 5xx errors
  if (error instanceof APIError && error.statusCode >= 500) {
    return true;
  }

  // Retry on rate limiting (after delay)
  if (error instanceof APIError && error.statusCode === 429) {
    return true;
  }

  // Don't retry on client errors (4xx except 429)
  if (error instanceof APIError && error.statusCode >= 400 && error.statusCode < 500) {
    return false;
  }

  return true;
}

// Format error for API response
export function formatErrorResponse(error: unknown) {
  if (error instanceof APIError) {
    return {
      status: error.statusCode,
      body: error.toJSON(),
    };
  }

  // Log unexpected errors
  console.error('Unexpected error:', error);

  return {
    status: 500,
    body: {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
        statusCode: 500,
      },
    },
  };
}
