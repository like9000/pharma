import { NextResponse } from 'next/server';
import { prisma } from '@pharma/shared';

interface Params {
  params: { id: string };
}

export async function GET(_request: Request, { params }: Params) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      steps: { orderBy: { createdAt: 'asc' } },
      productImports: { orderBy: { createdAt: 'asc' } },
    },
  });
  if (!job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 });
  }
  return NextResponse.json(job);
}
