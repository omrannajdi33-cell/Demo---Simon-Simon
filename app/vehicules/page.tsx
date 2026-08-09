'use client';

import Link from 'next/link';
import { Header, PageContainer } from '@/components/layout/Header';
import { useStore, getVehiculeOwner } from '@/lib/store';

export default function VehiculesPage() {
  const { state } = useStore();

  return (
    <>
      <Header />
      <PageContainer title="Véhicules" subtitle="Parc automobile de vos clients">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {state.vehicules.map((vehicule) => {
            const owner = getVehiculeOwner(state, vehicule.id);
            return (
              <Link
                key={vehicule.id}
                href={`/vehicules/${vehicule.id}`}
                className="card hover:border-brand-silver/30 group"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-brand-white transition-colors">
                      {vehicule.marque} {vehicule.modele}
                    </h3>
                    <p className="text-brand-silver">{vehicule.annee}</p>
                    <p className="text-brand-light text-sm mt-1">{vehicule.couleur}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-brand-light">Propriétaire</p>
                    <p className="font-medium">{owner?.nom || '—'}</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </PageContainer>
    </>
  );
}
