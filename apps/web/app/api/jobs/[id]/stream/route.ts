import { NextResponse } from 'next/server';
import type { JobTimelineEvent } from '@pharma/shared';
import { Redis } from 'ioredis';

interface Params {
  params: { id: string };
}

const redisUrl = process.env.REDIS_URL ?? 'redis://localhost:6379';

export async function GET(_request: Request, { params }: Params) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const subscriber = new Redis(redisUrl);
      await subscriber.subscribe('job-events');

      const handler = (_channel: string, payload: string) => {
        try {
          const event = JSON.parse(payload) as JobTimelineEvent & { jobId: string };
          if (event.jobId !== params.id) {
            return;
          }
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`));
        } catch (error) {
          console.error('Failed to parse job event', error);
        }
      };

      subscriber.on('message', handler);
      controller.enqueue(encoder.encode('retry: 5000\n\n'));

      return () => {
        subscriber.off('message', handler);
        void subscriber.unsubscribe('job-events');
        void subscriber.quit();
      };
    },
  });

  return new NextResponse(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
