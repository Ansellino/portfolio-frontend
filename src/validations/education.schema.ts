import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(255),
  degree: z.string().min(1, 'Degree is required').max(255),
  fieldOfStudy: z.string().optional(),
  grade: z.string().optional(),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  isPublished: z.boolean().default(true),
});
