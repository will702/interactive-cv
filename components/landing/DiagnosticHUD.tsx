'use client';
import React from 'react';
import { useCvStore } from '@/lib/cvStore';

const STATUS_LABEL = {
  loading: 'Loading',
  ready: 'Ready',
  error: 'Error',
} as const;

export function DiagnosticHUD({ mousePos, mode }: { mousePos: { x: number, y: number }, mode: string }) {
  const cvStatus = useCvStore((s) => s.cvStatus);

  const statusDot =
    cvStatus === 'ready' ? 'bg-indigo-900' :
    cvStatus === 'error' ? 'bg-rose-600' :
    'bg-slate-300 animate-pulse';
  const statusText =
    cvStatus === 'ready' ? 'text-indigo-900' :
    cvStatus === 'error' ? 'text-rose-600' :
    'text-slate-400';

  return (
    <div aria-hidden="true" className="fixed bottom-12 left-1/2 -translate-x-1/2 hidden md:flex items-center gap-12 px-10 py-4 bg-white border border-slate-200 z-50 rounded-full font-sans text-[10px] text-slate-400 uppercase tracking-[0.2em]">
      <div className="flex items-center gap-6">
        <div className="flex gap-4">
          <span className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">Pos_X:</span>
            <span className="text-indigo-900 w-10 font-bold">{Math.round(mousePos.x).toString().padStart(4, '0')}</span>
          </span>
          <span className="flex items-center gap-2">
            <span className="text-slate-300 font-bold">Pos_Y:</span>
            <span className="text-indigo-900 w-10 font-bold">{Math.round(mousePos.y).toString().padStart(4, '0')}</span>
          </span>
        </div>
      </div>

      <div className="h-4 w-px bg-slate-200" />

      <div className="flex items-center gap-6">
        <span className="flex items-center gap-3">
          <span className="text-slate-300 font-bold">Active_Mode:</span>
          <span className="text-indigo-900 font-bold italic serif lowercase tracking-normal text-xs px-3 py-0.5 bg-indigo-50 border border-indigo-100 rounded-full">
            {mode}
          </span>
        </span>

        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${statusDot}`} />
          <span className="text-slate-300 font-bold">SYS_STATUS:</span>
          <span className={`font-bold ${statusText}`}>{STATUS_LABEL[cvStatus]}</span>
        </div>
      </div>
    </div>
  );
}
