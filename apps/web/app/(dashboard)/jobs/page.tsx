import Link from 'next/link';
import { prisma } from '@pharma/shared';

interface JobsPageProps {
  searchParams?: { siteId?: string };
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const jobs = await prisma.job.findMany({
    where: searchParams?.siteId ? { siteId: searchParams.siteId } : undefined,
    orderBy: { createdAt: 'desc' },
    take: 50,
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Jobs</h1>
          <p className="text-sm text-slate-500">Historique des imports produits.</p>
        </div>
        <Link
          href="/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500"
        >
          Nouveau job
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left font-medium text-slate-600">ID</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Site</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Statut</th>
              <th className="px-4 py-3 text-left font-medium text-slate-600">Créé le</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {jobs.map((job) => (
              <tr key={job.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono text-xs">
                  <Link className="text-blue-600 hover:underline" href={`/jobs/${job.id}`}>
                    {job.id.split('-')[0]}
                  </Link>
                </td>
                <td className="px-4 py-3">{job.siteId}</td>
                <td className="px-4 py-3 capitalize">{job.status}</td>
                <td className="px-4 py-3 text-slate-500">{job.createdAt.toLocaleString('fr-FR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {jobs.length === 0 && (
          <div className="p-6 text-center text-sm text-slate-500">Aucun job pour le moment.</div>
        )}
      </div>
    </main>
  );
}
