'use client';

import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createJobSchema, type CreateJobInput } from '@pharma/shared';
import { toast } from 'react-hot-toast';

const formSchema = createJobSchema.extend({
  urls: z.array(z.string().url()).optional().default([]),
  urlsRaw: z.string().optional(),
  file: z.instanceof(File).optional(),
});

type FormValues = z.infer<typeof formSchema>;

type SiteOption = {
  id: string;
  domain: string;
};

export default function CreateJobForm({ sites }: { sites: SiteOption[] }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      urls: [],
      options: { mirrorImages: false, dryRun: false },
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    try {
      const urls = data.urlsRaw
        ? data.urlsRaw
            .split(/\n+/)
            .map((line) => line.trim())
            .filter(Boolean)
        : data.urls ?? [];

      if (urls.length === 0) {
        toast.error('Merci de renseigner au moins une URL produit.');
        setIsSubmitting(false);
        return;
      }

      const payload: CreateJobInput = {
        siteId: data.siteId,
        domain: data.domain,
        serverIp: data.serverIp,
        urls,
        options: data.options,
      };
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        throw new Error('Impossible de créer le job');
      }
      const json = await res.json();
      toast.success('Job créé avec succès');
      window.location.href = `/jobs/${json.id}`;
    } catch (error) {
      console.error(error);
      toast.error('Erreur lors de la création du job');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    setValue('urlsRaw', text, { shouldDirty: true });
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleSubmit(onSubmit)(event);
  };

  return (
    <form onSubmit={handleFormSubmit} className="space-y-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Site
          <select
            {...register('siteId')}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          >
            <option value="">Sélectionnez un site</option>
            {sites.map((site) => (
              <option key={site.id} value={site.id}>
                {site.domain}
              </option>
            ))}
          </select>
          {errors.siteId && <span className="text-xs text-rose-600">{errors.siteId.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Domaine cible
          <input
            {...register('domain')}
            placeholder="ex: boutique.example.com"
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.domain && <span className="text-xs text-rose-600">{errors.domain.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          IP serveur
          <input
            {...register('serverIp')}
            placeholder="ex: 203.0.113.10"
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
          {errors.serverIp && <span className="text-xs text-rose-600">{errors.serverIp.message}</span>}
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Upload .txt (URLs)
          <input
            type="file"
            accept=".txt"
            onChange={handleFile}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>
      </div>
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium">URLs produit</label>
        <textarea
          {...register('urlsRaw')}
          rows={8}
          placeholder="https://shop.example.com/p/sku-123\nhttps://shop.example.com/p/sku-456"
          className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
        />
        <p className="text-xs text-slate-500">Une URL par ligne, maximum 50 par job.</p>
      </div>
      <fieldset className="grid gap-4 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('options.mirrorImages')} /> Mirror Cloudflare R2
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" {...register('options.dryRun')} /> Dry-run (pas d&apos;appel WooCommerce)
        </label>
      </fieldset>
      <button
        type="submit"
        className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Création en cours...' : 'Lancer le job'}
      </button>
    </form>
  );
}
