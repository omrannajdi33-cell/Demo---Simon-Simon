'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, MapPin } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { DemoNote } from '@/components/ui/DemoNote';
import { useStore } from '@/lib/store';
import { DemandeStatus } from '@/lib/types';

export default function DemandeDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { state, updateDemandeStatus } = useStore();
  const [actionMsg, setActionMsg] = useState('');

  const id = searchParams.get('id');
  const demande = id ? state.demandes.find((d) => d.id === id) : undefined;

  if (!demande) {
    return (
      <>
        <Header />
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-brand-light mb-4">Demande introuvable</p>
          <Link href="/demandes" className="btn-primary inline-block">
            Retour aux demandes
          </Link>
        </div>
      </>
    );
  }

  const handleAction = (status: DemandeStatus) => {
    updateDemandeStatus(demande.id, status);

    if (status === 'acceptee') {
      setActionMsg(`Courriel de confirmation envoyé à ${demande.clientEmail} (simulation)`);
    } else if (status === 'refusee') {
      setActionMsg(`Courriel de refus envoyé à ${demande.clientEmail} (simulation)`);
    } else if (status === 'en_analyse') {
      setActionMsg(`Courriel de demande d'infos envoyé à ${demande.clientEmail} (simulation)`);
    }

    if (status === 'acceptee') {
      setTimeout(() => router.push('/rendez-vous'), 2000);
    }
  };

  const canAct = demande.status === 'nouvelle' || demande.status === 'en_analyse';

  return (
    <>
      <Header />
      <div className="max-w-4xl mx-auto px-6 py-8 animate-fade-in">
        <Link
          href="/demandes"
          className="inline-flex items-center gap-2 text-brand-light hover:text-brand-white mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux demandes
        </Link>

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">{demande.clientNom}</h1>
            <p className="text-brand-light mt-1">
              {demande.vehiculeMarque} {demande.vehiculeModele} — {demande.vehiculeAnnee}
            </p>
          </div>
          <StatusBadge status={demande.status} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">Client</h2>
            <p className="text-lg font-medium mb-3">{demande.clientNom}</p>
            <div className="space-y-2 text-brand-silver">
              <p className="flex items-center gap-2"><Phone className="w-4 h-4" />{demande.clientTelephone}</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4" />{demande.clientEmail}</p>
              <p className="flex items-center gap-2"><MapPin className="w-4 h-4" />{demande.ville}</p>
            </div>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">Véhicule</h2>
            <p className="text-lg font-medium mb-1">{demande.vehiculeMarque} {demande.vehiculeModele}</p>
            <p className="text-brand-silver">{demande.vehiculeAnnee}</p>
            <p className="text-brand-light mt-2">{demande.vehiculeCouleur}</p>
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">Service</h2>
            <p className="text-lg font-medium">{demande.service}</p>
            {demande.budget && <p className="text-brand-light mt-2">Budget : {demande.budget}</p>}
          </div>

          <div className="card">
            <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">
              Photos {demande.photos > 0 && `(${demande.photos})`}
            </h2>
            {demande.photoUrls && demande.photoUrls.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {demande.photoUrls.map((url, i) => (
                  <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="aspect-square rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                  </a>
                ))}
              </div>
            ) : demande.photos > 0 ? (
              <p className="text-brand-light text-sm">{demande.photos} photo(s) (données fictives)</p>
            ) : (
              <p className="text-brand-light text-sm">Aucune photo</p>
            )}
          </div>
        </div>

        <div className="card mb-8">
          <h2 className="text-sm font-semibold text-brand-light uppercase tracking-wider mb-4">Message</h2>
          <p className="text-brand-silver italic leading-relaxed">
            « {demande.message || 'Aucun message'} »
          </p>
        </div>

        {actionMsg && (
          <DemoNote>
            ✉️ {actionMsg}
          </DemoNote>
        )}

        {canAct ? (
          <div className="space-y-4 mt-6">
            <DemoNote>
              En production, chaque action enverrait un courriel automatique au client (confirmation, refus ou demande d&apos;infos).
            </DemoNote>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => handleAction('acceptee')} className="btn-success">Accepter</button>
              <button className="btn-secondary">Contacter</button>
              <button onClick={() => handleAction('en_analyse')} className="btn-secondary">
                Demander plus d&apos;infos
              </button>
              <button onClick={() => handleAction('refusee')} className="btn-danger">Refuser</button>
            </div>
          </div>
        ) : (
          <div className="card bg-brand-muted/30 mt-6">
            <p className="text-brand-light">
              Cette demande a été{' '}
              <span className="text-brand-white font-medium">
                {demande.status === 'acceptee' ? 'acceptée' : demande.status === 'refusee' ? 'refusée' : 'traitée'}
              </span>
            </p>
          </div>
        )}
      </div>
    </>
  );
}
