import { z } from 'zod';

export const RegisterDto = z.object({
  name: z.string(),
  email: z.string().email(),
  password: z.string().min(6)
});

export const LoginDto = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

/* 🔑 Infer TS types */
export type RegisterInput = z.infer<typeof RegisterDto>;
export type LoginInput = z.infer<typeof LoginDto>;
