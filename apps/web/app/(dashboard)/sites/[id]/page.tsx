import { notFound } from 'next/navigation';
import { prisma } from '@pharma/shared';

interface SiteDetailPageProps {
  params: { id: string };
}

export default async function SiteDetailPage({ params }: SiteDetailPageProps) {
  const site = await prisma.site.findUnique({ where: { id: params.id } });
  if (!site) notFound();
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">{site.domain}</h1>
        <p className="text-sm text-slate-500">Status: {site.status}</p>
      </div>
      <p className="text-sm text-slate-500">
        Cette page présentera l&apos;historique et les informations générales du site. Utilisez l&apos;onglet Overrides pour la configuration.
      </p>
    </main>
  );
}
