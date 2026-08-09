import { initialData } from '@/lib/data';
import DemandeDetailPage from './DemandeDetailPage';

export function generateStaticParams() {
  return initialData.demandes.map((demande) => ({ id: demande.id }));
}

export default function Page() {
  return <DemandeDetailPage />;
}
