'use client';

import { useState, useRef } from 'react';
import { Check, ChevronRight, Camera, ArrowLeft, X, Sparkles, Shield, Clock, ImageIcon } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ServiceType, DemandeFormData } from '@/lib/types';

const services: ServiceType[] = [
  'Detailing',
  'Correction de peinture',
  'Céramique',
  'PPF',
  'Vitres teintées',
];

const MAX_PHOTOS = 6;
const MAX_SIZE_MB = 5;
const FORM_STEPS = 4;

const initialForm: DemandeFormData = {
  service: '',
  marque: '',
  modele: '',
  annee: '',
  couleur: '',
  message: '',
  photos: 0,
  photoUrls: [],
  nom: '',
  telephone: '',
  email: '',
};

const benefits = [
  { icon: Sparkles, text: 'Service personnalisé selon votre véhicule' },
  { icon: Shield, text: 'Detailing, céramique, PPF et plus' },
  { icon: ImageIcon, text: 'Envoi de photos pour une estimation précise' },
  { icon: Clock, text: 'Réponse rapide de notre équipe' },
];

function readFileAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function ClientHeader() {
  return (
    <header className="border-b border-brand-muted/50 bg-brand-dark/80 backdrop-blur-sm">
      <div className="max-w-lg mx-auto px-6 py-6 text-center">
        <p className="text-[10px] text-brand-light tracking-[0.3em] uppercase mb-2">Espace client</p>
        <h1 className="text-2xl font-bold tracking-tight">SIMON & SIMON</h1>
        <p className="text-xs text-brand-light tracking-widest uppercase mt-1">
          Esthétique Automobile
        </p>
      </div>
    </header>
  );
}

function ClientFooter() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-brand-dark/90 backdrop-blur-sm border-t border-brand-muted/50 py-3 px-6">
      <p className="text-center text-xs text-brand-light">
        Prototype / Concept — Démonstration interactive
      </p>
    </footer>
  );
}

export default function DemoDemandePage() {
  const { addDemande } = useStore();
  const [started, setStarted] = useState(false);
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<DemandeFormData>(initialForm);
  const [submitted, setSubmitted] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateForm = (field: keyof DemandeFormData, value: string | number | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handlePhotos = async (files: FileList | null) => {
    if (!files) return;
    setUploadError('');

    const remaining = MAX_PHOTOS - form.photoUrls.length;
    const toAdd = Array.from(files).slice(0, remaining);

    for (const file of toAdd) {
      if (!file.type.startsWith('image/')) {
        setUploadError('Seules les images sont acceptées.');
        return;
      }
      if (file.size > MAX_SIZE_MB * 1024 * 1024) {
        setUploadError(`Chaque photo doit faire moins de ${MAX_SIZE_MB} Mo.`);
        return;
      }
    }

    try {
      const urls = await Promise.all(toAdd.map(readFileAsDataURL));
      const newUrls = [...form.photoUrls, ...urls];
      setForm((prev) => ({ ...prev, photoUrls: newUrls, photos: newUrls.length }));
    } catch {
      setUploadError('Erreur lors du téléversement.');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removePhoto = (index: number) => {
    const newUrls = form.photoUrls.filter((_, i) => i !== index);
    setForm((prev) => ({ ...prev, photoUrls: newUrls, photos: newUrls.length }));
  };

  const handleSubmit = () => {
    addDemande(form);
    setSubmitted(true);
  };

  const canProceed = () => {
    switch (step) {
      case 0: return form.marque && form.modele && form.annee && form.couleur;
      case 1: return form.service !== '';
      case 2: return true;
      case 3: return form.nom && form.telephone && form.email;
      default: return false;
    }
  };

  const stepLabels = ['Véhicule', 'Service', 'Projet', 'Coordonnées'];

  /* ── Confirmation ── */
  if (submitted) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col">
        <ClientHeader />
        <div className="flex-1 flex items-center justify-center p-6 pb-20">
          <div className="text-center animate-slide-up max-w-md">
            <div className="w-20 h-20 bg-status-accepted/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-status-accepted" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Demande envoyée</h1>
            <p className="text-brand-light text-lg leading-relaxed mb-2">
              Merci {form.nom.split(' ')[0]}. Votre demande de soumission a bien été reçue.
            </p>
            <p className="text-brand-silver text-sm">
              Simon & Simon examinera votre projet et vous contactera prochainement avec une estimation personnalisée.
            </p>
            <div className="mt-8 p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-400">
              <strong>Astuce démo :</strong> Retournez au{' '}
              <a href="/dashboard" className="underline hover:text-amber-300">Dashboard</a>{' '}
              pour voir la nouvelle demande apparaître en temps réel.
            </div>
          </div>
        </div>
        <ClientFooter />
      </div>
    );
  }

  /* ── Landing vitrine ── */
  if (!started) {
    return (
      <div className="min-h-screen bg-brand-black flex flex-col pb-20">
        <ClientHeader />

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full animate-fade-in">
            <div className="card text-center p-8 sm:p-10">
              <div className="w-16 h-16 bg-brand-muted/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-8 h-8 text-brand-silver" />
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold leading-tight mb-3">
                Votre véhicule mérite le meilleur
              </h2>
              <p className="text-brand-light leading-relaxed mb-8">
                Décrivez-nous votre projet et recevez une estimation personnalisée en quelques étapes.
              </p>

              <ul className="text-left space-y-4 mb-10">
                {benefits.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex items-start gap-3 text-sm text-brand-silver">
                    <span className="w-5 h-5 rounded-full bg-status-accepted/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3 h-3 text-status-accepted" />
                    </span>
                    {text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => setStarted(true)}
                className="btn-primary w-full text-base py-4"
              >
                Demander une soumission
              </button>

              <p className="text-xs text-brand-light mt-4">
                Une fois acceptée, vous pourrez choisir votre rendez-vous.
              </p>
            </div>
          </div>
        </div>

        <ClientFooter />
      </div>
    );
  }

  /* ── Formulaire multi-étapes ── */
  return (
    <div className="min-h-screen bg-brand-black pb-20">
      <ClientHeader />

      <div className="max-w-lg mx-auto px-6 py-6">
        <div className="flex items-center justify-between mb-2">
          {Array.from({ length: FORM_STEPS }).map((_, s) => (
            <div
              key={s}
              className={`flex-1 h-1 mx-1 rounded-full transition-colors ${
                s <= step ? 'bg-brand-white' : 'bg-brand-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-sm text-brand-light text-center">
          Étape {step + 1} sur {FORM_STEPS} — {stepLabels[step]}
        </p>
      </div>

      <div className="max-w-lg mx-auto px-6 pb-12 animate-fade-in">
        {/* Étape 1 — Véhicule */}
        {step === 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Votre véhicule</h2>
            <p className="text-brand-light mb-8">Indiquez les détails de votre automobile.</p>
            <div className="space-y-5">
              {([
                { field: 'marque' as const, label: 'Marque', placeholder: 'BMW' },
                { field: 'modele' as const, label: 'Modèle', placeholder: 'M4' },
                { field: 'annee' as const, label: 'Année', placeholder: '2024' },
                { field: 'couleur' as const, label: 'Couleur', placeholder: 'Noir' },
              ]).map(({ field, label, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-brand-light mb-2">{label}</label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={(e) => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Étape 2 — Service */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Quel service recherchez-vous ?</h2>
            <p className="text-brand-light mb-8">Sélectionnez le type de service souhaité.</p>
            <div className="space-y-3">
              {services.map((service) => (
                <button
                  key={service}
                  onClick={() => updateForm('service', service)}
                  className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                    form.service === service
                      ? 'bg-brand-white text-brand-black'
                      : 'bg-brand-dark border border-brand-muted hover:border-brand-silver'
                  }`}
                >
                  {service}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Étape 3 — Projet + photos */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Parlez-nous de votre projet</h2>
            <p className="text-brand-light mb-8">Décrivez vos besoins et ajoutez des photos pour une estimation précise.</p>
            <div className="space-y-5">
              <div>
                <label className="block text-sm text-brand-light mb-2">Description du projet</label>
                <textarea
                  value={form.message}
                  onChange={(e) => updateForm('message', e.target.value)}
                  rows={5}
                  placeholder="Je voudrais protéger l'avant de ma voiture..."
                  className="input-field resize-none"
                />
              </div>

              <div>
                <label className="block text-sm text-brand-light mb-2">
                  Photos ({form.photoUrls.length}/{MAX_PHOTOS})
                </label>

                {form.photoUrls.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mb-3">
                    {form.photoUrls.map((url, i) => (
                      <div key={i} className="relative aspect-square rounded-lg overflow-hidden group">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt={`Photo ${i + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removePhoto(i)}
                          className="absolute top-1 right-1 w-6 h-6 bg-brand-black/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {form.photoUrls.length < MAX_PHOTOS && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handlePhotos(e.target.files)}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full p-8 border-2 border-dashed border-brand-muted rounded-xl hover:border-brand-silver transition-colors flex flex-col items-center gap-2"
                    >
                      <Camera className="w-8 h-8 text-brand-light" />
                      <span className="text-brand-light">+ Téléverser des photos</span>
                      <span className="text-xs text-brand-light/60">JPG, PNG — max {MAX_SIZE_MB} Mo</span>
                    </button>
                  </>
                )}

                {uploadError && <p className="text-status-refused text-sm mt-2">{uploadError}</p>}
              </div>
            </div>
          </div>
        )}

        {/* Étape 4 — Coordonnées */}
        {step === 3 && (
          <div>
            <h2 className="text-2xl font-bold mb-2">Vos coordonnées</h2>
            <p className="text-brand-light mb-8">Pour vous envoyer votre estimation personnalisée.</p>
            <div className="space-y-5">
              {([
                { field: 'nom' as const, label: 'Nom complet', type: 'text', placeholder: 'Marc Tremblay' },
                { field: 'telephone' as const, label: 'Téléphone', type: 'tel', placeholder: '514-555-0100' },
                { field: 'email' as const, label: 'Courriel', type: 'email', placeholder: 'marc@email.com' },
              ]).map(({ field, label, type, placeholder }) => (
                <div key={field}>
                  <label className="block text-sm text-brand-light mb-2">{label}</label>
                  <input
                    type={type}
                    value={form[field]}
                    onChange={(e) => updateForm(field, e.target.value)}
                    placeholder={placeholder}
                    className="input-field"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 mt-10">
          <button
            onClick={() => (step === 0 ? setStarted(false) : setStep(step - 1))}
            className="btn-ghost flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour
          </button>
          <div className="flex-1" />
          {step < FORM_STEPS - 1 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canProceed()}
              className="btn-primary flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continuer
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Envoyer ma demande
            </button>
          )}
        </div>
      </div>

      <ClientFooter />
    </div>
  );
}
