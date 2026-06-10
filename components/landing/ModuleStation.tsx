'use client';
import React from 'react';
import Link from 'next/link';
import { LucideIcon } from 'lucide-react';

const ROUTE_MAP: Record<string, string> = {
  filtering: '/filtering',
  features: '/features',
  camera: '/camera-model',
  epipolar: '/epipolar',
};

interface Props {
  title: string;
  id: string;
  icon: LucideIcon;
  description: string;
  onHover: (id: string) => void;
}

export function ModuleStation({ title, id, icon: Icon, description, onHover }: Props) {
  const refId = `LESSON_${id.toUpperCase()}`;
  const href = ROUTE_MAP[id] ?? `/${id}`;
  const descLabel = description.split(':')[1]?.trim() || description;

  return (
    <Link
      href={href}
      onMouseEnter={() => onHover(id)}
      onMouseLeave={() => onHover('default')}
      onFocus={() => onHover(id)}
      onBlur={() => onHover('default')}
      aria-label={`${title} — ${descLabel}`}
      className="group relative block p-8 bg-white border border-slate-200 hover:border-indigo-900/30 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.05)] transition-all duration-500 overflow-hidden rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-900 focus-visible:ring-offset-2"
    >
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-8">
          <div className="p-0 text-slate-300 group-hover:text-indigo-900 transition-colors">
            <Icon size={28} strokeWidth={1.5} />
          </div>
          <span className="text-[9px] font-sans font-bold text-slate-300 tracking-[0.2em] group-hover:text-indigo-900/40 transition-colors">
            {refId}
          </span>
        </div>

        <div className="space-y-4">
          <h3 className="font-serif text-xl text-slate-900 tracking-tight leading-tight">
            {title}
          </h3>
          <p className="text-[10px] font-sans font-medium text-slate-400 uppercase tracking-[0.2em] group-hover:text-indigo-900 transition-colors">
            {descLabel}
          </p>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between">
          <span className="text-[9px] font-sans font-bold text-slate-300 uppercase tracking-widest">
            Begin Module
          </span>
          <div className="w-6 h-px bg-slate-200 group-hover:w-10 group-hover:bg-indigo-900 transition-all duration-500" />
        </div>
      </div>

      {/* Subtle Background Accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full -mr-16 -mt-16 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}
