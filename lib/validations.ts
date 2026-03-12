import { z } from 'zod';

// Zod Validation Schemas
// Audit Recommendation: 5.2 - Add Zod for Form Validation

// Common field validations
export const emailSchema = z.string().email('Please enter a valid email address');

export const phoneSchema = z
  .string()
  .regex(/^[+]?[\d\s-]{10,15}$/, 'Please enter a valid phone number');

export const pincodeSchema = z
  .string()
  .length(6, 'Pincode must be 6 digits')
  .regex(/^\d{6}$/, 'Pincode must contain only numbers');

export const nameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(100, 'Name must be less than 100 characters')
  .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens and apostrophes');

// Checkout form schema
export const checkoutSchema = z.object({
  email: emailSchema,
  phone: phoneSchema,
  firstName: nameSchema,
  lastName: nameSchema,
  address1: z.string().min(5, 'Address must be at least 5 characters'),
  address2: z.string().optional(),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  pincode: pincodeSchema,
  country: z.string().default('India'),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

// Contact form schema
export const contactSchema = z.object({
  name: nameSchema,
  email: emailSchema,
  phone: phoneSchema.optional(),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message too long'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

// Lead capture form schema (Performance Marketing)
export const leadCaptureSchema = z.object({
  name: nameSchema,
  phone: phoneSchema,
  email: emailSchema,
  city: z.string().min(2, 'City is required').max(100, 'City name too long'),
  investmentInterest: z.enum(
    ['₹50L – ₹1 Cr', '₹1 Cr – ₹2 Cr', '₹2 Cr – ₹5 Cr', '₹5 Cr+'],
    { message: 'Please select an investment range' }
  ),
  message: z.string().max(500, 'Message too long').optional(),
});

export type LeadCaptureFormData = z.infer<typeof leadCaptureSchema>;

// Login schema
export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
  firstName: nameSchema,
  lastName: nameSchema,
  email: emailSchema,
  phone: phoneSchema,
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Pincode check schema
export const pincodeCheckSchema = z.object({
  pincode: pincodeSchema,
});

// Newsletter subscription schema
export const newsletterSchema = z.object({
  email: emailSchema,
});

export type NewsletterFormData = z.infer<typeof newsletterSchema>;

// Product review schema
export const reviewSchema = z.object({
  rating: z.number().min(1, 'Please select a rating').max(5),
  title: z.string().min(3, 'Title must be at least 3 characters').max(100),
  content: z.string().min(10, 'Review must be at least 10 characters').max(500),
  name: nameSchema,
  email: emailSchema,
});

export type ReviewFormData = z.infer<typeof reviewSchema>;

// Helper to get error message from Zod error
export function getZodErrorMessage(error: z.ZodError): string {
  return error.issues.map((e) => e.message).join(', ');
}

// Helper to validate and return result
export function validateForm<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; error: string } {
  const result = schema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: getZodErrorMessage(result.error) };
}
