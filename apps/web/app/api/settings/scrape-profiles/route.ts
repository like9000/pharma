import { NextResponse } from 'next/server';
import { prisma } from '@pharma/shared';

export async function GET() {
  const profiles = await prisma.scrapeProfile.findMany({ orderBy: { createdAt: 'desc' } });
  return NextResponse.json(profiles);
}
