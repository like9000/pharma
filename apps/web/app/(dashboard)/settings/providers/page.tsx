import Link from 'next/link';

export default function ProvidersSettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Providers & Secrets</h1>
        <p className="text-sm text-slate-500">
          Gérer les clés API (Cloudflare, WooCommerce, LLM, R2, SSH, OVH). Les valeurs sont chiffrées en base.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Cette page proposera prochainement un formulaire sécurisé pour créer, mettre à jour et tester les secrets.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          En attendant, utilisez les seeds pour injecter les secrets par défaut ou ajoutez-les via Prisma Studio.
        </p>
      </section>
      <div className="text-sm text-slate-500">
        Besoin de personnaliser un site spécifique ? Rendez-vous sur{' '}
        <Link className="text-blue-600 hover:underline" href="/sites">
          la section Sites
        </Link>
        .
      </div>
    </main>
  );
}
