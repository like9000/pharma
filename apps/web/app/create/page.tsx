import { prisma } from '@pharma/shared';
import CreateJobForm from '@/components/create-job-form';

export default async function CreateJobPage() {
  const sites = await prisma.site.findMany({ orderBy: { domain: 'asc' } });
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold">Créer un job</h1>
        <p className="text-sm text-slate-500">
          Configurez un import de produits en collant des URLs ou en téléversant un fichier .txt.
        </p>
      </div>
      <CreateJobForm sites={sites} />
    </main>
  );
}
