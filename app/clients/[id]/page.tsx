'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Car, ClipboardList, Calendar } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import {
  useStore,
  getClientVehicules,
  getClientDemandes,
  getClientRendezVous,
  getVehiculeHistorique,
} from '@/lib/store';

export default function ClientDetailPage() {
  const params = useParams();
  const { state } = useStore();

  const client = state.clients.find((c) => c.id === params.id);

  if (!client) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-brand-light mb-4">Client introuvable</p>
          <Link href="/clients" className="btn-primary inline-block">
            Retour aux clients
          </Link>
        </div>
      </>
    );
  }

  const vehicules = getClientVehicules(state, client.id);
  const demandes = getClientDemandes(state, client.id);
  const rendezVous = getClientRendezVous(state, client.id);

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        <Link
          href="/clients"
          className="inline-flex items-center gap-2 text-brand-light hover:text-brand-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux clients
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{client.nom}</h1>
          <div className="flex flex-wrap gap-6 text-brand-silver">
            <span className="flex items-center gap-2">
              <Phone className="w-4 h-4" />
              {client.telephone}
            </span>
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              {client.email}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card text-center">
            <Car className="w-6 h-6 mx-auto mb-2 text-brand-light" />
            <p className="text-2xl font-bold">{vehicules.length}</p>
            <p className="text-sm text-brand-light">Véhicules</p>
          </div>
          <div className="card text-center">
            <ClipboardList className="w-6 h-6 mx-auto mb-2 text-brand-light" />
            <p className="text-2xl font-bold">{demandes.length}</p>
            <p className="text-sm text-brand-light">Demandes</p>
          </div>
          <div className="card text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-brand-light" />
            <p className="text-2xl font-bold">{rendezVous.length}</p>
            <p className="text-sm text-brand-light">Rendez-vous</p>
          </div>
          <div className="card text-center">
            <p className="text-sm text-brand-light mb-1">Dernière visite</p>
            <p className="text-lg font-medium">{client.derniereVisite}</p>
          </div>
        </div>

        {/* Vehicules */}
        <div className="card mb-6">
          <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
            Véhicules
          </h2>
          <div className="space-y-3">
            {vehicules.map((v) => (
              <Link
                key={v.id}
                href={`/vehicules/${v.id}`}
                className="flex items-center justify-between p-4 bg-brand-gray rounded-lg hover:bg-brand-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium">
                    {v.marque} {v.modele} — {v.annee}
                  </p>
                  <p className="text-sm text-brand-light">{v.couleur}</p>
                </div>
                <span className="text-brand-light">→</span>
              </Link>
            ))}
            {vehicules.length === 0 && (
              <p className="text-brand-light">Aucun véhicule enregistré</p>
            )}
          </div>
        </div>

        {/* Historique */}
        <div className="card">
          <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
            Historique
          </h2>
          <div className="space-y-3">
            {vehicules.flatMap((v) =>
              getVehiculeHistorique(state, v.id).map((h) => (
                <div
                  key={h.id}
                  className="flex items-center justify-between py-3 border-b border-brand-muted/30 last:border-0"
                >
                  <div>
                    <p className="font-medium">{h.service}</p>
                    <p className="text-sm text-brand-light">{h.date}</p>
                  </div>
                  {h.prix && (
                    <p className="text-brand-silver">{h.prix.toLocaleString('fr-CA')} $</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
