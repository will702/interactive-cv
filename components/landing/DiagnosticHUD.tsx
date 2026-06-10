'use client';
import React from 'react';

export function DiagnosticHUD({ mousePos, mode }: { mousePos: { x: number, y: number }, mode: string }) {
  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 px-10 py-4 bg-white/80 backdrop-blur-xl border border-slate-200 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.05)] z-50 rounded-full font-sans text-[10px] text-slate-400 uppercase tracking-[0.2em]">
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
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-900/20" />
          <span className="text-slate-300 font-bold italic">Curated_State:</span>
          <span className="text-indigo-900 font-bold">Ready</span>
        </div>
      </div>
    </div>
  );
}
