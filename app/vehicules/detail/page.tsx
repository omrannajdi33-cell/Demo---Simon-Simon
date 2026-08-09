'use client';

import { Suspense } from 'react';
import VehiculeDetailContent from '../VehiculeDetailContent';

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center text-brand-light">
      Chargement…
    </div>
  );
}

export default function VehiculeDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VehiculeDetailContent />
    </Suspense>
  );
}
