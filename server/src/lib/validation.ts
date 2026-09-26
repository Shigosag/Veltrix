import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Please enter a valid work email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const datasetCreateSchema = z.object({
  name: z.string().trim().min(2, 'Dataset name must be at least 2 characters'),
  description: z.string().optional(),
  tags: z.array(z.string().trim()).default([]),
  jsonData: z.array(z.record(z.unknown())).min(1, 'At least one record is required in payload'),
});

export const anomalyUpdateSchema = z.object({
  status: z.enum(['active', 'investigating', 'resolved']),
});

export const profileUpdateSchema = z.object({
  name: z.string().trim().min(2, 'Name is required').optional(),
  title: z.string().trim().optional(),
  company: z.string().trim().optional(),
  location: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

export const preferencesUpdateSchema = z.object({
  theme: z.enum(['dark', 'light']).optional(),
  compactDensity: z.boolean().optional(),
  reducedMotion: z.boolean().optional(),
  monoFont: z.string().trim().optional(),
  emailAlerts: z.boolean().optional(),
  insightDigest: z.boolean().optional(),
  weeklyReport: z.boolean().optional(),
});

export const analyticsFilterSchema = z.object({
  timeRange: z.enum(['7D', '30D', '90D', '6M', '1Y', 'Custom']).default('30D'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  metrics: z.array(z.string()).optional(),
});
