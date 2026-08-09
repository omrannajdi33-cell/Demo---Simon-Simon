'use client';

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { AppState, Demande, DemandeFormData, DemandeStatus } from './types';
import { initialData } from './data';

const STORAGE_KEY = 'simon-simon-demo-state';

interface StoreContextType {
  state: AppState;
  addDemande: (formData: DemandeFormData) => void;
  updateDemandeStatus: (id: string, status: DemandeStatus) => void;
  clearNewDemandeFlag: () => void;
  resetDemo: () => void;
}

const StoreContext = createContext<StoreContextType | null>(null);

function loadState(): AppState {
  if (typeof window === 'undefined') return initialData;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...initialData, ...parsed };
    }
  } catch {
    // ignore
  }
  return initialData;
}

function saveState(state: AppState) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(initialData);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadState());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) {
      saveState(state);
    }
  }, [state, hydrated]);

  const addDemande = useCallback((formData: DemandeFormData) => {
    const newDemande: Demande = {
      id: `d-${Date.now()}`,
      clientNom: formData.nom,
      clientTelephone: formData.telephone,
      clientEmail: formData.email,
      vehiculeMarque: formData.marque,
      vehiculeModele: formData.modele,
      vehiculeAnnee: parseInt(formData.annee) || new Date().getFullYear(),
      vehiculeCouleur: formData.couleur,
      service: formData.service as Demande['service'],
      message: formData.message,
      photos: formData.photoUrls.length,
      photoUrls: formData.photoUrls,
      ville: 'Montréal',
      budget: 'À déterminer',
      status: 'nouvelle',
      dateCreation: new Date().toISOString().split('T')[0],
      isNew: true,
    };

    setState((prev) => ({
      ...prev,
      demandes: [newDemande, ...prev.demandes],
      hasNewDemande: true,
    }));
  }, []);

  const updateDemandeStatus = useCallback((id: string, status: DemandeStatus) => {
    setState((prev) => ({
      ...prev,
      demandes: prev.demandes.map((d) =>
        d.id === id ? { ...d, status, isNew: false } : d
      ),
    }));
  }, []);

  const clearNewDemandeFlag = useCallback(() => {
    setState((prev) => ({ ...prev, hasNewDemande: false }));
  }, []);

  const resetDemo = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(initialData);
  }, []);

  if (!hydrated) {
    return (
      <div className="min-h-screen bg-brand-black flex items-center justify-center">
        <div className="text-brand-silver animate-pulse">Chargement...</div>
      </div>
    );
  }

  return (
    <StoreContext.Provider
      value={{ state, addDemande, updateDemandeStatus, clearNewDemandeFlag, resetDemo }}
    >
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within StoreProvider');
  }
  return context;
}

export function getStatusLabel(status: DemandeStatus): string {
  const labels: Record<DemandeStatus, string> = {
    nouvelle: 'Nouvelle',
    en_analyse: 'En analyse',
    acceptee: 'Acceptée',
    refusee: 'Refusée',
    confirmee: 'Confirmé',
  };
  return labels[status];
}

export function getStatusColor(status: DemandeStatus): string {
  const colors: Record<DemandeStatus, string> = {
    nouvelle: 'bg-status-new/20 text-status-new border-status-new/30',
    en_analyse: 'bg-status-analysis/20 text-status-analysis border-status-analysis/30',
    acceptee: 'bg-status-accepted/20 text-status-accepted border-status-accepted/30',
    refusee: 'bg-status-refused/20 text-status-refused border-status-refused/30',
    confirmee: 'bg-status-confirmed/20 text-status-confirmed border-status-confirmed/30',
  };
  return colors[status];
}

export function getClientVehicules(state: AppState, clientId: string) {
  return state.vehicules.filter((v) => v.clientId === clientId);
}

export function getVehiculeHistorique(state: AppState, vehiculeId: string) {
  return state.historique.filter((h) => h.vehiculeId === vehiculeId);
}

export function getClientDemandes(state: AppState, clientId: string) {
  const client = state.clients.find((c) => c.id === clientId);
  if (!client) return [];
  return state.demandes.filter(
    (d) => d.clientId === clientId || d.clientNom === client.nom
  );
}

export function getClientRendezVous(state: AppState, clientId: string) {
  return state.rendezVous.filter((r) => r.clientId === clientId);
}

export function getVehiculeOwner(state: AppState, vehiculeId: string) {
  const vehicule = state.vehicules.find((v) => v.id === vehiculeId);
  if (!vehicule) return null;
  return state.clients.find((c) => c.id === vehicule.clientId);
}
