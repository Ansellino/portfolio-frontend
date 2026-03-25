import { z } from 'zod';

export const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required').max(255),
  degree: z.string().min(1, 'Degree is required').max(255),
  fieldOfStudy: z.string().optional(),
  gpa: z
    .string()
    .optional()
    .refine((value) => {
      if (!value || value.trim() === '') return true;
      const num = Number(value);
      return Number.isFinite(num) && num >= 0 && num <= 4;
    }, 'GPA must be between 0 and 4'),
  description: z.string().optional(),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  isPublished: z.boolean().default(true),
});
