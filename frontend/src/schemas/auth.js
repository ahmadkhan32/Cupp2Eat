import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirm_password: z.string(),
}).refine(data => data.password === data.confirm_password, {
  message: "Passwords don't match",
  path: ['confirm_password'],
});

export const addressSchema = z.object({
  full_name: z.string().min(2),
  phone: z.string().regex(/^[6-9]\d{9}$/, 'Invalid Indian mobile number'),
  house_no: z.string().min(1, 'House/building details required'),
  street: z.string().min(1, 'Street required'),
  city: z.string().min(1, 'City required'),
  state: z.string().min(1, 'State required'),
  pincode: z.string().regex(/^\d{6}$/, 'Enter valid 6-digit PIN code'),
  delivery_instructions: z.string().optional(),
});

export const checkoutSchema = addressSchema.extend({
  email: z.string().email(),
  payment_method: z.enum(['stripe', 'upi', 'cod', 'netbanking', 'razorpay']),
});

export const createAdminSchema = z.object({
  full_name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8, 'Admin password must be at least 8 characters'),
  role: z.enum(['org_admin', 'admin']),
  organization_name: z.string().optional(),
});
