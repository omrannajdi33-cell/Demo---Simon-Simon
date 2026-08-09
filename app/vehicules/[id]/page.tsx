import { initialData } from '@/lib/data';
import VehiculeDetailPage from './VehiculeDetailPage';

export function generateStaticParams() {
  return initialData.vehicules.map((vehicule) => ({ id: vehicule.id }));
}

export default function Page() {
  return <VehiculeDetailPage />;
}
