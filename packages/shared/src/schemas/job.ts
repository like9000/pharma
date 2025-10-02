import { z } from 'zod';

export const jobStatusSchema = z.enum(['queued', 'running', 'success', 'failed']);
export type JobStatus = z.infer<typeof jobStatusSchema>;

export const jobStepStatusSchema = z.enum(['pending', 'running', 'success', 'failed']);
export type JobStepStatus = z.infer<typeof jobStepStatusSchema>;

export const createJobSchema = z.object({
  siteId: z.string().uuid(),
  domain: z.string().min(3),
  serverIp: z.string().min(3),
  urls: z.array(z.string().url()).min(1),
  options: z
    .object({
      mirrorImages: z.boolean().optional(),
      dryRun: z.boolean().optional(),
      duplicatorUrl: z.string().url().optional(),
    })
    .optional(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;

export const jobStepSchema = z.object({
  id: z.string().uuid(),
  jobId: z.string().uuid(),
  name: z.string(),
  status: jobStepStatusSchema,
  startedAt: z.coerce.date().nullable(),
  finishedAt: z.coerce.date().nullable(),
  logsJson: z.unknown().nullable(),
});

export const jobSchema = z.object({
  id: z.string().uuid(),
  siteId: z.string().uuid(),
  inputJson: z.unknown(),
  status: jobStatusSchema,
  createdAt: z.coerce.date(),
  finishedAt: z.coerce.date().nullable(),
});

export const jobWithStepsSchema = jobSchema.extend({
  steps: z.array(jobStepSchema),
});

export type JobWithSteps = z.infer<typeof jobWithStepsSchema>;

export const jobTimelineEventSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('step-start'),
    jobId: z.string().uuid(),
    stepId: z.string().uuid(),
    name: z.string(),
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal('step-log'),
    jobId: z.string().uuid(),
    stepId: z.string().uuid(),
    timestamp: z.number(),
    message: z.string(),
    level: z.enum(['info', 'warn', 'error']).default('info'),
  }),
  z.object({
    type: z.literal('step-end'),
    jobId: z.string().uuid(),
    stepId: z.string().uuid(),
    status: jobStepStatusSchema,
    timestamp: z.number(),
  }),
  z.object({
    type: z.literal('job-end'),
    jobId: z.string().uuid(),
    status: jobStatusSchema,
    timestamp: z.number(),
  }),
]);

export type JobTimelineEvent = z.infer<typeof jobTimelineEventSchema>;
