import Link from 'next/link';

export default function ScrapingSettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Profils de scraping</h1>
        <p className="text-sm text-slate-500">
          Définissez les sélecteurs CSS, règles de nettoyage et stratégies d&apos;images/prix.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Les profils seront listés ici avec un bouton &laquo; Playground &raquo; pour tester en temps réel sur une URL.
        </p>
        <p className="mt-2 text-sm text-slate-500">
          Le backend expose déjà l&apos;endpoint `/api/settings/scrape-profiles/:id/test` (mock à implémenter dans les prochaines étapes).
        </p>
      </section>
      <div className="text-sm text-slate-500">
        Consultez également les <Link className="text-blue-600 hover:underline" href="/settings/prompts">prompts IA</Link> pour la réécriture.
      </div>
    </main>
  );
}
