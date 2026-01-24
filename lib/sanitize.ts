// Input sanitization utilities
// Audit Recommendation: 4.1 - Input Sanitization

/**
 * Sanitize string input to prevent XSS attacks
 * Removes HTML tags and encodes special characters
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Sanitize email input
 */
export function sanitizeEmail(email: string): string {
  if (typeof email !== 'string') {
    return '';
  }
  
  // Basic email sanitization - lowercase and trim
  return email.toLowerCase().trim();
}

/**
 * Sanitize phone number - keep only digits and + symbol
 */
export function sanitizePhone(phone: string): string {
  if (typeof phone !== 'string') {
    return '';
  }
  
  return phone.replace(/[^\d+]/g, '');
}

/**
 * Sanitize pincode - keep only digits
 */
export function sanitizePincode(pincode: string): string {
  if (typeof pincode !== 'string') {
    return '';
  }
  
  return pincode.replace(/\D/g, '').slice(0, 6);
}

/**
 * Validate and sanitize URL
 */
export function sanitizeUrl(url: string): string | null {
  if (typeof url !== 'string') {
    return null;
  }
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (!['http:', 'https:'].includes(parsed.protocol)) {
      return null;
    }
    return parsed.toString();
  } catch {
    return null;
  }
}

/**
 * Sanitize object - recursively sanitize all string values
 */
export function sanitizeObject<T extends Record<string, any>>(obj: T): T {
  const sanitized: Record<string, any> = {};
  
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (Array.isArray(value)) {
      sanitized[key] = value.map((item) =>
        typeof item === 'string' ? sanitizeString(item) : item
      );
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  
  return sanitized as T;
}

/**
 * Validate input against common patterns
 */
export const validators = {
  email: (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
  phone: (value: string) => /^[+]?[\d\s-]{10,15}$/.test(value),
  pincode: (value: string) => /^\d{6}$/.test(value),
  name: (value: string) => /^[a-zA-Z\s'-]{2,100}$/.test(value),
  alphanumeric: (value: string) => /^[a-zA-Z0-9]+$/.test(value),
  numeric: (value: string) => /^\d+$/.test(value),
};

/**
 * Escape HTML for safe rendering
 */
export function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  
  return text.replace(/[&<>"']/g, (char) => map[char] || char);
}
