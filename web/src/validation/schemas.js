import { z } from 'zod';

/**
 * Zod validation schemas for all forms across the app.
 */

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'Name is too long'),
  lastName: z.string().optional(),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string()
    .min(10, 'Phone number must be at least 10 digits')
    .max(15, 'Phone number is too long')
    .regex(/^[0-9]+$/, 'Phone number must contain only digits'),
  password: z.string().min(6, 'Password must be at least 6 characters').max(100, 'Password is too long'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const bookingSchema = z.object({
  providerId: z.number().positive('Please select a provider'),
  serviceDate: z.string().min(1, 'Please select a date'),
  serviceTime: z.string().min(1, 'Please select a time'),
  serviceAddress: z.string().min(10, 'Please enter your complete address (at least 10 characters)').max(500, 'Address is too long'),
});

export const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(2000),
});

