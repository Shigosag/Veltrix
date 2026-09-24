import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid work email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const datasetCreateSchema = z.object({
  name: z.string().min(2, 'Dataset name required'),
  description: z.string().optional(),
  tags: z.array(z.string()).default([]),
  jsonData: z.array(z.record(z.unknown())).min(1, 'At least one record is required'),
});

export const analyticsFilterSchema = z.object({
  timeRange: z.enum(['7D', '30D', '90D', '6M', '1Y', 'Custom']).default('30D'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional(),
});
