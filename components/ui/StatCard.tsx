import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  value: string | number;
  label: string;
  icon?: LucideIcon;
  highlight?: boolean;
}

export function StatCard({ value, label, icon: Icon, highlight }: StatCardProps) {
  return (
    <div className={`stat-card ${highlight ? 'border-status-new/50' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-4xl font-bold text-brand-white">{value}</span>
        {Icon && <Icon className="w-8 h-8 text-brand-light" />}
      </div>
      <span className="text-brand-light text-sm">{label}</span>
    </div>
  );
}
