import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters').max(200, 'Title must be at most 200 characters'),
  slug: z.string().max(255).optional(),
  excerpt: z.string().min(10, 'Excerpt must be at least 10 characters').max(400, 'Excerpt must be at most 400 characters'),
  content: z.string().min(20, 'Content must be at least 20 characters'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  category: z.enum(['Tutorial', 'Guide', 'Opinion', 'Case Study'], {
    message: 'Category must be one of: Tutorial, Guide, Opinion, Case Study',
  }),
  readingTimeMin: z.number().int().min(1).default(1),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});
