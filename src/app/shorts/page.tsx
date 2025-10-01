import { Suspense } from 'react';
import ShortsContent from './ShortsContent';

function ShortsLoading() {
  return (
    <div className="w-full h-screen bg-black flex items-center justify-center">
      <div className="text-white text-center">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p>載入 Shorts...</p>
      </div>
    </div>
  );
}

export default function ShortsPage() {
  return (
    <Suspense fallback={<ShortsLoading />}>
      <ShortsContent />
    </Suspense>
  );
}