import type { Job as BullJob } from 'bullmq';
import { prisma, logger } from '@pharma/shared';
import { Redis } from 'ioredis';

type ProductJobData = {
  jobId: string;
};

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const publisher = new Redis(redisUrl);

export async function productWorkerProcessor(job: BullJob<ProductJobData>) {
  logger.info({ jobId: job.data.jobId }, 'Product worker received job');
  const dbJob = await prisma.job.update({
    where: { id: job.data.jobId },
    data: { status: 'running' },
  });

  const steps = [
    'resolve-config',
    'scrape',
    'clean-html',
    'llm-rewrite',
    'mirror-images',
    'woo-upsert',
  ];

  for (const stepName of steps) {
    const step = await prisma.jobStep.create({
      data: {
        jobId: dbJob.id,
        name: stepName,
        status: 'running',
        startedAt: new Date(),
      },
    });

    await publisher.publish(
      'job-events',
      JSON.stringify({
        type: 'step-start',
        jobId: dbJob.id,
        stepId: step.id,
        name: step.name,
        timestamp: Date.now(),
      }),
    );

    logger.info({ jobId: job.data.jobId, step: step.name }, 'Executing step (stub)');

    await prisma.jobStep.update({
      where: { id: step.id },
      data: {
        status: 'success',
        finishedAt: new Date(),
      },
    });

    await publisher.publish(
      'job-events',
      JSON.stringify({
        type: 'step-end',
        jobId: dbJob.id,
        stepId: step.id,
        status: 'success',
        timestamp: Date.now(),
      }),
    );
  }

  await prisma.job.update({
    where: { id: dbJob.id },
    data: { status: 'success', finishedAt: new Date() },
  });

  await publisher.publish(
    'job-events',
    JSON.stringify({ type: 'job-end', jobId: dbJob.id, status: 'success', timestamp: Date.now() }),
  );

  logger.info({ jobId: job.data.jobId }, 'Job completed (stub pipeline)');
}

export async function closeProductWorkerPublisher() {
  await publisher.quit();
}
