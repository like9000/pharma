import Link from 'next/link';
import { prisma } from '@pharma/shared';

export default async function SitesPage() {
  const sites = await prisma.site.findMany({ orderBy: { createdAt: 'desc' } });
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Sites</h1>
        <p className="text-sm text-slate-500">Configurez les overrides (scraping, prompts, mapping, secrets).</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {sites.map((site) => (
          <article key={site.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium">{site.domain}</h2>
            <p className="text-sm text-slate-500">Status: {site.status}</p>
            <Link className="mt-4 inline-flex text-sm text-blue-600 hover:underline" href={`/sites/${site.id}/overrides`}>
              Gérer les overrides
            </Link>
          </article>
        ))}
        {sites.length === 0 && (
          <div className="rounded border border-dashed border-slate-300 p-6 text-center text-slate-500">
            Ajoutez votre premier site via Prisma Studio ou les seeds.
          </div>
        )}
      </div>
    </main>
  );
}
