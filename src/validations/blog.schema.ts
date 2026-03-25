import { z } from 'zod';

export const blogSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  slug: z.string().min(1, 'Slug is required').max(255),
  excerpt: z.string().min(1, 'Excerpt is required'),
  content: z.string().min(1, 'Content is required'),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  category: z.enum(['Tutorial', 'Guide', 'Opinion', 'Case Study'], {
    message: 'Category must be one of: Tutorial, Guide, Opinion, Case Study',
  }),
  readingTimeMin: z.number().int().min(1).default(1),
  isPublished: z.boolean().default(true),
  publishedAt: z.string().optional(),
  tagIds: z.array(z.string()).optional(),
});
