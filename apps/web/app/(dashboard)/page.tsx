import Link from 'next/link';
import { prisma } from '@pharma/shared';

export default async function DashboardPage() {
  const sites = await prisma.site.findMany({
    orderBy: { createdAt: 'desc' },
    take: 20,
  });

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Sites</h1>
          <p className="text-sm text-slate-500">Surveillez vos sites et lancez des jobs d&apos;import.</p>
        </div>
        <Link
          href="/create"
          className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-500"
        >
          Créer un job
        </Link>
      </header>
      <section className="grid gap-4 md:grid-cols-2">
        {sites.length === 0 && (
          <div className="rounded border border-dashed border-slate-300 p-6 text-center text-slate-500">
            Aucun site pour l&apos;instant. Ajoutez un site pour démarrer.
          </div>
        )}
        {sites.map((site) => (
          <article key={site.id} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-medium">{site.domain}</h2>
            <p className="text-sm text-slate-500">IP serveur: {site.serverIp}</p>
            <div className="mt-4 flex items-center justify-between text-sm">
              <span
                className={`rounded px-2 py-1 text-xs font-semibold uppercase ${
                  site.status === 'ready'
                    ? 'bg-emerald-100 text-emerald-700'
                    : site.status === 'error'
                    ? 'bg-rose-100 text-rose-700'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {site.status}
              </span>
              {site.wpAdminUrl ? (
                <Link className="text-blue-600 hover:underline" href={site.wpAdminUrl}>
                  WP Admin
                </Link>
              ) : (
                <span className="text-slate-400">WP Admin non défini</span>
              )}
            </div>
            <div className="mt-4 flex gap-2 text-sm">
              <Link className="text-blue-600 hover:underline" href={`/sites/${site.id}/overrides`}>
                Overrides
              </Link>
              <Link className="text-blue-600 hover:underline" href={`/jobs?siteId=${site.id}`}>
                Jobs
              </Link>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
