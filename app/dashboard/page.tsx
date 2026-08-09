'use client';

import Link from 'next/link';
import { ClipboardList, Calendar, Users, DollarSign } from 'lucide-react';
import { Header, PageContainer } from '@/components/layout/Header';
import { StatCard } from '@/components/ui/StatCard';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { useStore } from '@/lib/store';
import { stats } from '@/lib/data';

export default function DashboardPage() {
  const { state } = useStore();
  const recentDemandes = state.demandes.slice(0, 3);

  return (
    <>
      <Header />
      <PageContainer title="Dashboard" subtitle="Vue d'ensemble de votre activité">
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard
            value={stats.demandesEnAttente}
            label="Demandes en attente"
            icon={ClipboardList}
            highlight={state.hasNewDemande}
          />
          <StatCard
            value={stats.rendezVousSemaine}
            label="Rendez-vous cette semaine"
            icon={Calendar}
          />
          <StatCard
            value={stats.clientsActifs}
            label="Clients actifs"
            icon={Users}
          />
          <StatCard
            value={`${stats.revenusMois.toLocaleString('fr-CA')} $`}
            label="Revenus du mois"
            icon={DollarSign}
          />
        </div>

        {/* Recent demandes */}
        <div className="card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Demandes récentes</h2>
            <Link href="/demandes" className="text-brand-silver hover:text-brand-white text-sm transition-colors">
              Voir toutes les demandes →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-brand-light text-sm border-b border-brand-muted/50">
                  <th className="pb-3 font-medium">Client</th>
                  <th className="pb-3 font-medium">Véhicule</th>
                  <th className="pb-3 font-medium">Service</th>
                  <th className="pb-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {recentDemandes.map((demande) => (
                  <tr
                    key={demande.id}
                    className={`table-row ${demande.isNew ? 'bg-status-new/5' : ''}`}
                  >
                    <td className="py-4">
                      <Link href={`/demandes/${demande.id}`} className="hover:text-brand-white">
                        <span className="font-medium">{demande.clientNom}</span>
                        {demande.isNew && (
                          <span className="ml-2 inline-flex w-2 h-2 bg-status-new rounded-full animate-pulse-soft" />
                        )}
                      </Link>
                    </td>
                    <td className="py-4 text-brand-silver">
                      {demande.vehiculeMarque} {demande.vehiculeModele} {demande.vehiculeAnnee}
                    </td>
                    <td className="py-4 text-brand-silver">{demande.service}</td>
                    <td className="py-4">
                      <StatusBadge status={demande.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Link href="/demandes" className="card hover:border-brand-silver/30 group">
            <h3 className="font-semibold mb-2 group-hover:text-brand-white transition-colors">
              Gérer les demandes
            </h3>
            <p className="text-sm text-brand-light">
              Consultez et traitez les nouvelles soumissions clients
            </p>
          </Link>
          <Link href="/rendez-vous" className="card hover:border-brand-silver/30 group">
            <h3 className="font-semibold mb-2 group-hover:text-brand-white transition-colors">
              Calendrier
            </h3>
            <p className="text-sm text-brand-light">
              Visualisez et gérez vos rendez-vous à venir
            </p>
          </Link>
          <Link href="/demo-demande" target="_blank" className="card hover:border-brand-silver/30 group">
            <h3 className="font-semibold mb-2 group-hover:text-brand-white transition-colors">
              Espace client
            </h3>
            <p className="text-sm text-brand-light">
              Testez le parcours de demande de soumission
            </p>
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
