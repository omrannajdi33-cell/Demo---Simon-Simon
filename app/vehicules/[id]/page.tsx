'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { useStore, getVehiculeHistorique, getVehiculeOwner } from '@/lib/store';

export default function VehiculeDetailPage() {
  const params = useParams();
  const { state } = useStore();

  const vehicule = state.vehicules.find((v) => v.id === params.id);

  if (!vehicule) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-brand-light mb-4">Véhicule introuvable</p>
          <Link href="/vehicules" className="btn-primary inline-block">
            Retour aux véhicules
          </Link>
        </div>
      </>
    );
  }

  const owner = getVehiculeOwner(state, vehicule.id);
  const historique = getVehiculeHistorique(state, vehicule.id);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        <Link
          href="/vehicules"
          className="inline-flex items-center gap-2 text-brand-light hover:text-brand-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux véhicules
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            {vehicule.marque} {vehicule.modele} — {vehicule.annee}
          </h1>
          <p className="text-brand-light mt-2">{vehicule.couleur}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
              Propriétaire
            </h2>
            {owner ? (
              <Link
                href={`/clients/${owner.id}`}
                className="text-lg font-medium hover:text-brand-white transition-colors"
              >
                {owner.nom}
              </Link>
            ) : (
              <p className="text-brand-light">—</p>
            )}
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
              Détails
            </h2>
            <div className="space-y-2 text-brand-silver">
              <p>Marque : {vehicule.marque}</p>
              <p>Modèle : {vehicule.modele}</p>
              <p>Année : {vehicule.annee}</p>
              <p>Couleur : {vehicule.couleur}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
            Historique des services
          </h2>
          <div className="space-y-4">
            {historique.map((h) => (
              <div
                key={h.id}
                className="flex items-center justify-between py-4 border-b border-brand-muted/30 last:border-0"
              >
                <div>
                  <p className="font-medium">{h.service}</p>
                  <p className="text-sm text-brand-light">{h.date}</p>
                </div>
                {h.prix && (
                  <p className="text-brand-silver font-medium">
                    {h.prix.toLocaleString('fr-CA')} $
                  </p>
                )}
              </div>
            ))}
            {historique.length === 0 && (
              <p className="text-brand-light py-4">Aucun service enregistré</p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
