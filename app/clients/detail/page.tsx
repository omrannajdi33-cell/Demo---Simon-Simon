'use client';

import { Suspense } from 'react';
import ClientDetailContent from '../ClientDetailContent';

function LoadingFallback() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-16 text-center text-brand-light">
      Chargement…
    </div>
  );
}

export default function ClientDetailPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <ClientDetailContent />
    </Suspense>
  );
}
