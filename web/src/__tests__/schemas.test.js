import { describe, it, expect } from 'vitest';
import { loginSchema, registerSchema, bookingSchema } from '../validation/schemas';

describe('Validation Schemas', () => {
  describe('loginSchema', () => {
    it('validates correct email and password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('fails with invalid email', () => {
      const result = loginSchema.safeParse({
        email: 'not-an-email',
        password: 'password123',
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('valid email');
    });

    it('fails with empty password', () => {
      const result = loginSchema.safeParse({
        email: 'test@example.com',
        password: '',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('registerSchema', () => {
    it('validates correct registration data', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '9999999999',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(true);
    });

    it('fails when passwords do not match', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        email: 'john@example.com',
        phone: '9999999999',
        password: 'password123',
        confirmPassword: 'different',
      });
      expect(result.success).toBe(false);
      expect(result.error.errors[0].message).toContain('do not match');
    });

    it('fails with short phone number', () => {
      const result = registerSchema.safeParse({
        firstName: 'John',
        email: 'john@example.com',
        phone: '123',
        password: 'password123',
        confirmPassword: 'password123',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('bookingSchema', () => {
    it('validates correct booking data', () => {
      const result = bookingSchema.safeParse({
        providerId: 1,
        serviceDate: '2026-06-25',
        serviceTime: '14:00',
        serviceAddress: '123 Main Street, Chhindwara',
      });
      expect(result.success).toBe(true);
    });

    it('fails with short address', () => {
      const result = bookingSchema.safeParse({
        providerId: 1,
        serviceDate: '2026-06-25',
        serviceTime: '14:00',
        serviceAddress: '123',
      });
      expect(result.success).toBe(false);
    });
  });
});
