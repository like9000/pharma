import { Worker } from 'bullmq';
import { productWorkerProcessor, closeProductWorkerPublisher } from './productWorker.js';
import { provisionWorkerProcessor } from './provisionWorker.js';
import { logger, prisma } from '@pharma/shared';
import { Redis } from 'ioredis';

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';
const connection = new Redis(redisUrl);

logger.info({ redisUrl }, 'Starting workers');

const productWorker = new Worker('product-import', productWorkerProcessor, {
  connection,
  concurrency: 2,
});

const provisionWorker = new Worker('provision', provisionWorkerProcessor, {
  connection,
  concurrency: 1,
});

const shutdown = async () => {
  logger.info('Shutting down workers');
  await productWorker.close();
  await provisionWorker.close();
  await closeProductWorkerPublisher();
  await connection.quit();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
