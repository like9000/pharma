import { Queue } from 'bullmq';
import { getRedis } from './redis';

const connection = getRedis();

export const productQueue = new Queue('product-import', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1_000 },
    removeOnComplete: 100,
    removeOnFail: 500,
  },
});
