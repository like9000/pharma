import type { Job as BullJob } from 'bullmq';
import { logger } from '@pharma/shared';

type ProvisionJobData = {
  siteId: string;
};

export async function provisionWorkerProcessor(job: BullJob<ProvisionJobData>) {
  logger.info({ siteId: job.data.siteId }, 'Provision worker placeholder');
}
