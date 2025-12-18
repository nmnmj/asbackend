import { z } from 'zod';

export const UpdateProfileDto = z.object({
  name: z.string().min(2).max(50),
});
