import { notFound } from 'next/navigation';
import { prisma } from '@pharma/shared';

interface OverridesPageProps {
  params: { id: string };
}

export default async function SiteOverridesPage({ params }: OverridesPageProps) {
  const site = await prisma.site.findUnique({ where: { id: params.id } });
  if (!site) notFound();
  const override = await prisma.siteOverride.findFirst({ where: { siteId: site.id } });

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Overrides — {site.domain}</h1>
        <p className="text-sm text-slate-500">
          Sélectionnez les profils/prompt/mapping spécifiques ou laissez les valeurs globales par défaut.
        </p>
      </div>
      <section className="space-y-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Cette interface affichera prochainement des select pickers alimentés depuis la base. Les overrides actuels sont :
        </p>
        <pre className="overflow-auto rounded bg-slate-900 p-4 text-xs text-slate-100">
{JSON.stringify(override, null, 2)}
        </pre>
      </section>
    </main>
  );
}
