export default function PromptsSettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Prompts IA</h1>
        <p className="text-sm text-slate-500">
          Gérez les templates utilisés pour la description longue et la description courte des produits.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Cette page proposera la versioning, la duplication et le rollback des prompts. Les seeds incluent déjà les prompts par défaut.
        </p>
      </section>
    </main>
  );
}
