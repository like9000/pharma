import { NextResponse } from 'next/server';
import { createJobSchema } from '@pharma/shared';
import { prisma } from '@pharma/shared';
import { productQueue } from '@/server/queues';

export async function GET() {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  return NextResponse.json(jobs);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createJobSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const job = await prisma.job.create({
    data: {
      siteId: parsed.data.siteId,
      status: 'queued',
      inputJson: parsed.data,
    },
  });

  await productQueue.add('import', { jobId: job.id });

  return NextResponse.json({ id: job.id });
}
