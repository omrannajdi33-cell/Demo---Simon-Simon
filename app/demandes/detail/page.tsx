'use client';

import { Suspense } from 'react';
import DemandeDetailContent from '../DemandeDetailContent';

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center text-brand-light">
      Chargement…
    </div>
  );
}

export default function DemandeDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <DemandeDetailContent />
    </Suspense>
  );
}
