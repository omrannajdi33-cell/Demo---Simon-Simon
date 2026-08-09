'use client';

import { Bell, Calendar, Clock, Star, CheckCircle } from 'lucide-react';
import { Header, PageContainer } from '@/components/layout/Header';

const automations = [
  {
    icon: Bell,
    title: 'Nouvelle demande',
    description: 'Notification au propriétaire',
    active: true,
  },
  {
    icon: Calendar,
    title: 'Rendez-vous confirmé',
    description: 'Confirmation automatique au client',
    active: true,
  },
  {
    icon: Clock,
    title: 'Rendez-vous demain',
    description: 'Rappel automatique',
    active: true,
  },
  {
    icon: Star,
    title: 'Service terminé',
    description: 'Message de suivi + demande d\'avis',
    active: true,
  },
];

export default function AutomatisationsPage() {
  return (
    <>
      <Header />
      <PageContainer
        title="Automatisations"
        subtitle="Gagnez du temps avec des workflows automatiques"
      >
        <div className="bg-brand-dark border border-brand-muted/50 rounded-xl p-6 mb-8">
          <p className="text-brand-silver leading-relaxed">
            Une version complète du système pourrait automatiser vos communications clients,
            vos rappels et vos suivis post-service — sans intervention manuelle.
          </p>
        </div>

        <div className="space-y-4">
          {automations.map((auto) => (
            <div
              key={auto.title}
              className="card flex items-center gap-6 hover:border-brand-silver/30"
            >
              <div className="w-12 h-12 bg-status-accepted/10 rounded-xl flex items-center justify-center flex-shrink-0">
                <auto.icon className="w-6 h-6 text-status-accepted" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg">{auto.title}</h3>
                <p className="text-brand-light">{auto.description}</p>
              </div>
              <div className="flex items-center gap-2 text-status-accepted">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Actif</span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 card bg-brand-gray/50">
          <h3 className="font-semibold mb-4">Automatisations possibles en version complète</h3>
          <ul className="space-y-3 text-brand-light">
            <li className="flex items-start gap-3">
              <span className="text-brand-silver">→</span>
              Envoi automatique de soumissions par courriel
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-silver">→</span>
              Rappels SMS la veille du rendez-vous
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-silver">→</span>
              Demande d&apos;avis Google après chaque service
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-silver">→</span>
              Relance automatique des clients inactifs
            </li>
            <li className="flex items-start gap-3">
              <span className="text-brand-silver">→</span>
              Génération de factures à la fin du service
            </li>
          </ul>
        </div>
      </PageContainer>
    </>
  );
}
