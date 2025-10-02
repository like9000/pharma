import { notFound } from 'next/navigation';
import { prisma } from '@pharma/shared';
import JobTimeline from '@/components/job-timeline';

interface JobDetailPageProps {
  params: { id: string };
}

type SerializableStep = {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'success' | 'failed';
  startedAt: string | null;
  finishedAt: string | null;
};

export default async function JobDetailPage({ params }: JobDetailPageProps) {
  const job = await prisma.job.findUnique({
    where: { id: params.id },
    include: {
      steps: {
        orderBy: { createdAt: 'asc' },
      },
      productImports: {
        orderBy: { createdAt: 'asc' },
        take: 100,
      },
    },
  });

  if (!job) {
    notFound();
  }

  const serializableSteps: SerializableStep[] = job.steps.map((step) => ({
    id: step.id,
    name: step.name,
    status: step.status,
    startedAt: step.startedAt?.toISOString() ?? null,
    finishedAt: step.finishedAt?.toISOString() ?? null,
  }));

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Job #{job.id.split('-')[0]}</h1>
        <p className="text-sm text-slate-500">
          Statut: <span className="font-medium capitalize">{job.status}</span>
        </p>
      </div>
      <JobTimeline jobId={job.id} initialSteps={serializableSteps} status={job.status} />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-lg font-semibold">Produits</h2>
        <div className="mt-3 grid gap-2">
          {job.productImports.length === 0 && (
            <p className="text-sm text-slate-500">Aucun produit importé pour le moment.</p>
          )}
          {job.productImports.map((product) => (
            <article key={product.id} className="rounded border border-slate-200 p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{product.sku}</span>
                <span className="capitalize text-slate-500">{product.status}</span>
              </div>
              {product.message && <p className="mt-2 text-xs text-slate-500">{product.message}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
