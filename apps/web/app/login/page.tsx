'use client';

import { useState, type FormEvent } from 'react';
import { signIn } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    await signIn('email', { email, callbackUrl: '/' });
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-4 py-8">
      <h1 className="text-2xl font-semibold">Connexion</h1>
      <p className="text-sm text-slate-500">Recevez un lien magique par email.</p>
      <form onSubmit={onSubmit} className="space-y-4 rounded border border-slate-200 bg-white p-6 shadow-sm">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </label>
        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-500"
          disabled={loading}
        >
          {loading ? 'Envoi...' : 'Envoyer le lien'}
        </button>
      </form>
    </main>
  );
}
