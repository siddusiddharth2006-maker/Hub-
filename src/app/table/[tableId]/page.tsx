'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStore } from '@/store/useStore';

export default function TableRedirectPage() {
  const params = useParams();
  const router = useRouter();
  const { setTableNumber } = useStore();

  useEffect(() => {
    if (params?.tableId) {
      const tableIdStr = Array.isArray(params.tableId) ? params.tableId[0] : params.tableId;
      setTableNumber(tableIdStr);
      router.replace(`/?table=${tableIdStr}`);
    }
  }, [params, router, setTableNumber]);

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center font-sans">
      <div className="text-center space-y-2">
        <div className="w-8 h-8 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-white/60">Detecting Table QR Code...</p>
      </div>
    </div>
  );
}
