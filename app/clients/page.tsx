'use client';

import Link from 'next/link';
import { Header, PageContainer } from '@/components/layout/Header';
import { useStore, getClientVehicules } from '@/lib/store';

export default function ClientsPage() {
  const { state } = useStore();

  return (
    <>
      <Header />
      <PageContainer title="Clients" subtitle="Gérez votre base de clients">
        <div className="card overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-brand-light text-sm border-b border-brand-muted/50 bg-brand-gray/50">
                  <th className="px-6 py-4 font-medium">Client</th>
                  <th className="px-6 py-4 font-medium">Téléphone</th>
                  <th className="px-6 py-4 font-medium">Véhicule</th>
                  <th className="px-6 py-4 font-medium">Dernière visite</th>
                </tr>
              </thead>
              <tbody>
                {state.clients.map((client) => {
                  const vehicules = getClientVehicules(state, client.id);
                  const mainVehicule = vehicules[0];
                  return (
                    <tr key={client.id} className="table-row">
                      <td className="px-6 py-4">
                        <Link href={`/clients/detail?id=${client.id}`} className="font-medium hover:text-brand-white">
                          {client.nom}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-brand-silver">{client.telephone}</td>
                      <td className="px-6 py-4 text-brand-silver">
                        {mainVehicule
                          ? `${mainVehicule.marque} ${mainVehicule.modele}`
                          : '—'}
                      </td>
                      <td className="px-6 py-4 text-brand-light">{client.derniereVisite}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </PageContainer>
    </>
  );
}
