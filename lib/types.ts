export type DemandeStatus = 'nouvelle' | 'en_analyse' | 'acceptee' | 'refusee' | 'confirmee';
export type ServiceType = 'Detailing' | 'Correction de peinture' | 'Céramique' | 'PPF' | 'Vitres teintées' | 'PPF avant';
export type RendezVousStatus = 'confirme' | 'en_attente' | 'annule';

export interface Client {
  id: string;
  nom: string;
  telephone: string;
  email: string;
  derniereVisite: string;
}

export interface Vehicule {
  id: string;
  clientId: string;
  marque: string;
  modele: string;
  annee: number;
  couleur: string;
}

export interface ServiceHistorique {
  id: string;
  vehiculeId: string;
  service: string;
  date: string;
  prix?: number;
}

export interface Demande {
  id: string;
  clientId?: string;
  clientNom: string;
  clientTelephone: string;
  clientEmail: string;
  vehiculeMarque: string;
  vehiculeModele: string;
  vehiculeAnnee: number;
  vehiculeCouleur: string;
  service: ServiceType;
  message: string;
  photos: number;
  photoUrls?: string[];
  ville: string;
  budget?: string;
  status: DemandeStatus;
  dateCreation: string;
  isNew?: boolean;
}

export interface RendezVous {
  id: string;
  clientId: string;
  clientNom: string;
  vehicule: string;
  service: string;
  date: string;
  heure: string;
  status: RendezVousStatus;
}

export interface Facture {
  id: string;
  numero: string;
  clientNom: string;
  service: string;
  montant: number;
  status: 'payee' | 'en_attente' | 'en_retard';
  date: string;
}

export interface AppState {
  clients: Client[];
  vehicules: Vehicule[];
  demandes: Demande[];
  rendezVous: RendezVous[];
  historique: ServiceHistorique[];
  factures: Facture[];
  hasNewDemande: boolean;
}

export interface DemandeFormData {
  service: ServiceType | '';
  marque: string;
  modele: string;
  annee: string;
  couleur: string;
  message: string;
  photos: number;
  photoUrls: string[];
  nom: string;
  telephone: string;
  email: string;
}
