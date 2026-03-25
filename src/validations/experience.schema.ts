import { z } from 'zod';

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required').max(255),
  position: z.string().min(1, 'Position is required').max(255),
  description: z.string().optional(),
  responsibilities: z.array(z.string().min(1)).default([]),
  companyLogoUrl: z.string().url().optional().or(z.literal('')),
  startDate: z.string().min(1, 'Start date required'),
  endDate: z.string().optional(),
  location: z.string().optional(),
  employmentType: z.string().min(1, 'Employment type is required'),
});
