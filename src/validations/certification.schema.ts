import { z } from 'zod';

export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required').max(255),
  issuer: z.string().min(1, 'Issuer is required').max(255),
  category: z.string().min(1, 'Category is required').max(100),
  issueDate: z.string().min(1, 'Issue date required'),
  expirationDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().url().optional().or(z.literal('')),
  skillIds: z.array(z.string()).optional(),
});
