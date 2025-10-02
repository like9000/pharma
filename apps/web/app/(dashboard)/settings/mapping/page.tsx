export default function MappingSettingsPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Mapping WooCommerce</h1>
        <p className="text-sm text-slate-500">
          Visualisez et modifiez la correspondance entre les champs internes et WooCommerce.
        </p>
      </div>
      <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-sm text-slate-500">
          Une interface drag & drop sera ajoutée pour mapper rapidement un produit d&apos;exemple aux champs WooCommerce.
        </p>
      </section>
    </main>
  );
}
