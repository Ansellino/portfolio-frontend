import { z } from 'zod';

export const skillSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  category: z.string().min(1, 'Category is required'),
  iconUrl: z.string().url().optional().or(z.literal('')),
  isPublished: z.boolean().default(true),
});
