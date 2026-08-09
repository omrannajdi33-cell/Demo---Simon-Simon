'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Camera, MapPin } from 'lucide-react';
import { Header, PageContainer } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { DemandeStatus } from '@/lib/types';

const filters: { key: DemandeStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Toutes' },
  { key: 'nouvelle', label: 'Nouvelles' },
  { key: 'en_analyse', label: 'En analyse' },
  { key: 'acceptee', label: 'Acceptées' },
  { key: 'refusee', label: 'Refusées' },
];

export default function DemandesPage() {
  const { state } = useStore();
  const [filter, setFilter] = useState<DemandeStatus | 'all'>('all');

  const filteredDemandes =
    filter === 'all'
      ? state.demandes
      : state.demandes.filter((d) => d.status === filter);

  return (
    <>
      <Header />
      <PageContainer title="Demandes de soumission" subtitle="Gérez les demandes de vos clients">
        {/* Filters */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                filter === f.key
                  ? 'bg-brand-white text-brand-black'
                  : 'bg-brand-muted text-brand-light hover:text-brand-white'
              }`}
            >
              {f.label}
              {f.key === 'nouvelle' && state.demandes.filter((d) => d.status === 'nouvelle').length > 0 && (
                <span className="ml-2 bg-status-new text-white px-2 py-0.5 rounded-full text-xs">
                  {state.demandes.filter((d) => d.status === 'nouvelle').length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Demandes list */}
        <div className="space-y-4">
          {filteredDemandes.map((demande) => (
            <Link
              key={demande.id}
              href={`/demandes/detail?id=${demande.id}`}
              className={`card block hover:border-brand-silver/30 ${
                demande.isNew ? 'border-status-new/50 bg-status-new/5' : ''
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold">{demande.clientNom}</h3>
                    {demande.isNew && (
                      <span className="inline-flex w-2 h-2 bg-status-new rounded-full animate-pulse-soft" />
                    )}
                  </div>
                  <p className="text-brand-silver mb-1">
                    {demande.vehiculeMarque} {demande.vehiculeModele} — {demande.vehiculeAnnee}
                  </p>
                  <p className="text-brand-light text-sm">{demande.service}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-brand-light">
                    {demande.photos > 0 && (
                      <span className="flex items-center gap-1">
                        <Camera className="w-4 h-4" />
                        {demande.photos} photos
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {demande.ville}
                    </span>
                    {demande.budget && (
                      <span>Budget : {demande.budget}</span>
                    )}
                  </div>
                </div>
                <StatusBadge status={demande.status} />
              </div>
            </Link>
          ))}

          {filteredDemandes.length === 0 && (
            <div className="card text-center py-12 text-brand-light">
              Aucune demande dans cette catégorie
            </div>
          )}
        </div>
      </PageContainer>
    </>
  );
}
