'use client';

import { Header, PageContainer } from '@/components/layout/Header';
import { useStore } from '@/lib/store';

export default function FacturesPage() {
  const { state } = useStore();

  return (
    <>
      <Header />
      <PageContainer title="Facturation" subtitle="Aperçu de la gestion des factures">
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 mb-8 text-sm text-amber-400">
          Cette section est un aperçu visuel. La facturation et le paiement en ligne pourraient
          être intégrés dans une version complète.
        </div>

        <div className="flex justify-end mb-6">
          <button className="btn-primary">Créer une facture</button>
        </div>

        <div className="space-y-4">
          {state.factures.map((facture) => (
            <div key={facture.id} className="card flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-light">#{facture.numero}</p>
                <p className="text-lg font-semibold">{facture.clientNom}</p>
                <p className="text-brand-silver">{facture.service}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold">
                  {facture.montant.toLocaleString('fr-CA')} $
                </p>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-xs font-medium mt-2 ${
                    facture.status === 'payee'
                      ? 'bg-status-accepted/20 text-status-accepted'
                      : facture.status === 'en_retard'
                      ? 'bg-status-refused/20 text-status-refused'
                      : 'bg-status-analysis/20 text-status-analysis'
                  }`}
                >
                  {facture.status === 'payee'
                    ? 'Payée'
                    : facture.status === 'en_retard'
                    ? 'En retard'
                    : 'En attente'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </PageContainer>
    </>
  );
}
