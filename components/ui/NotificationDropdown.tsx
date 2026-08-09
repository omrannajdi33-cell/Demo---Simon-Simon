'use client';

import { useEffect, useRef, useState } from 'react';
import { Bell, X } from 'lucide-react';
import Link from 'next/link';
import { useStore } from '@/lib/store';

export function NotificationDropdown() {
  const { state, clearNewDemandeFlag } = useStore();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const newDemandes = state.demandes.filter((d) => d.isNew);
  const count = newDemandes.length;

  useEffect(() => {
    if (state.hasNewDemande && count > 0) {
      setOpen(true);
    }
  }, [state.hasNewDemande, count]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [open]);

  const dismiss = () => {
    setOpen(false);
    clearNewDemandeFlag();
  };

  return (
    <div ref={ref} className="relative flex-shrink-0">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 text-brand-light hover:text-brand-white hover:bg-brand-muted/50 rounded-lg transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center bg-status-new text-white text-[10px] font-bold rounded-full px-1">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 bg-brand-dark border border-brand-muted/50 rounded-xl shadow-2xl z-[60] animate-slide-up">
          <div className="flex items-center justify-between px-4 py-3 border-b border-brand-muted/30">
            <span className="font-semibold text-sm">
              Notifications {count > 0 && `(${count})`}
            </span>
            <button
              onClick={dismiss}
              className="text-brand-light hover:text-brand-white p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {newDemandes.length === 0 ? (
              <p className="text-brand-light text-sm text-center py-8">
                Aucune nouvelle notification
              </p>
            ) : (
              newDemandes.map((demande) => (
                <Link
                  key={demande.id}
                  href={`/demandes/${demande.id}`}
                  onClick={() => {
                    setOpen(false);
                    clearNewDemandeFlag();
                  }}
                  className="block px-4 py-3 hover:bg-brand-muted/30 border-b border-brand-muted/20 last:border-0 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1.5 w-2 h-2 bg-status-new rounded-full flex-shrink-0 animate-pulse-soft" />
                    <div className="min-w-0">
                      <p className="font-medium text-sm truncate">{demande.clientNom}</p>
                      <p className="text-xs text-brand-light truncate">
                        {demande.vehiculeMarque} {demande.vehiculeModele} {demande.vehiculeAnnee}
                      </p>
                      <p className="text-xs text-brand-silver">{demande.service}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {count > 0 && (
            <div className="p-3 border-t border-brand-muted/30">
              <Link
                href="/demandes"
                onClick={() => setOpen(false)}
                className="btn-primary w-full text-center text-sm py-2 block"
              >
                Voir toutes les demandes
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
