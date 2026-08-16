import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must contain an uppercase letter")
    .regex(/[a-z]/, "Password must contain a lowercase letter")
    .regex(/[0-9]/, "Password must contain a number"),
  name: z.string().min(1).optional(),
});

export const cnicSchema = z
  .string()
  .regex(/^\d{5}-\d{7}-\d$/, "Invalid CNIC format (XXXXX-XXXXXXX-X)")
  .or(z.literal(""));

export const bilingualSchema = z.object({
  en: z.string(),
  ur: z.string(),
});

export const dateValueSchema = z.object({
  day: z.string(),
  month: z.string(),
  year: z.string(),
});
