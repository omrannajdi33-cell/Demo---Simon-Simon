'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-brand-black flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold tracking-tight">Simon & Simon</h1>
          <p className="text-xs text-brand-light tracking-widest uppercase mt-2">
            Esthétique Automobile
          </p>
        </div>

        <div className="card">
          <h2 className="text-xl font-semibold mb-6 text-center">Connexion</h2>
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm text-brand-light mb-2">Courriel</label>
              <input
                type="email"
                defaultValue="demo@simon-simon.example"
                className="input-field"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm text-brand-light mb-2">Mot de passe</label>
              <input
                type="password"
                defaultValue="demo1234"
                className="input-field"
                readOnly
              />
            </div>
            <button type="submit" className="btn-primary w-full">
              Se connecter
            </button>
          </form>
          <p className="text-xs text-brand-light text-center mt-4">
            Démo — cliquez pour accéder au dashboard
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link
            href="/demo-demande"
            className="text-sm text-brand-light hover:text-brand-white transition-colors"
          >
            Voir l&apos;espace client →
          </Link>
        </div>

        <p className="text-center text-xs text-brand-light mt-8">
          Prototype / Concept — Authentification simulée
        </p>
      </div>
    </div>
  );
}
