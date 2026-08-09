import { DemandeStatus } from '@/lib/types';
import { getStatusLabel, getStatusColor } from '@/lib/store';

interface StatusBadgeProps {
  status: DemandeStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(status)}`}>
      {getStatusLabel(status)}
    </span>
  );
}
