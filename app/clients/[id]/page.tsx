import { initialData } from '@/lib/data';
import ClientDetailPage from './ClientDetailPage';

export function generateStaticParams() {
  return initialData.clients.map((client) => ({ id: client.id }));
}

export default function Page() {
  return <ClientDetailPage />;
}
