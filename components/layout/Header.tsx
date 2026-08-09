'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RotateCcw } from 'lucide-react';
import { useStore } from '@/lib/store';
import { NotificationDropdown } from '@/components/ui/NotificationDropdown';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/demandes', label: 'Demandes' },
  { href: '/clients', label: 'Clients' },
  { href: '/rendez-vous', label: 'Rendez-vous' },
  { href: '/vehicules', label: 'Véhicules' },
  { href: '/factures', label: 'Factures' },
  { href: '/automatisations', label: 'Automatisations' },
];

export default function DemoBanner() {
  return (
    <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-center text-sm text-amber-400">
      <span className="font-medium">Prototype / Concept</span>
      <span className="mx-2">—</span>
      Démonstration interactive — Données fictives
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const { state, resetDemo } = useStore();
  const newCount = state.demandes.filter((d) => d.isNew).length;

  return (
    <>
      <DemoBanner />
      <header className="border-b border-brand-muted/50 bg-brand-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Top row: logo + actions */}
          <div className="flex items-center justify-between py-3 gap-4">
            <Link href="/dashboard" className="flex flex-col flex-shrink-0">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-brand-white leading-tight">
                Simon & Simon
              </span>
              <span className="text-[10px] sm:text-xs text-brand-light tracking-widest uppercase">
                Esthétique Automobile
              </span>
            </Link>

            <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
              <NotificationDropdown />
              <Link
                href="/demo-demande"
                target="_blank"
                className="btn-secondary text-xs sm:text-sm py-2 px-3 hidden lg:inline-flex whitespace-nowrap"
              >
                Espace client →
              </Link>
              <button
                onClick={resetDemo}
                className="btn-ghost p-2 flex-shrink-0"
                title="Réinitialiser la démo"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Nav row — scrollable, never wraps */}
          <nav className="flex gap-1 sm:gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
            {navItems.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + '/');
              const showBadge = item.href === '/demandes' && newCount > 0;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap flex-shrink-0 transition-colors ${
                    isActive
                      ? 'bg-brand-muted/60 text-brand-white'
                      : 'text-brand-light hover:text-brand-white hover:bg-brand-muted/30'
                  }`}
                >
                  {item.label}
                  {showBadge && (
                    <span className="min-w-[18px] h-[18px] flex items-center justify-center bg-status-new text-white text-[10px] font-bold rounded-full px-1">
                      {newCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </header>
    </>
  );
}

export function PageContainer({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 animate-fade-in">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-brand-white">{title}</h1>
        {subtitle && <p className="text-brand-light mt-1 sm:mt-2 text-sm sm:text-base">{subtitle}</p>}
      </div>
      {children}
    </div>
  );
}
