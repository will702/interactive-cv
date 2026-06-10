'use client';

import Link from 'next/link';
import { Home, Search, Camera, Globe, Layers, BookOpen } from 'lucide-react';
import { usePathname } from 'next/navigation';

export function Sidebar() {
  const pathname = usePathname();
  
  const links = [
    { href: '/', label: 'Introduction', icon: Home },
    { href: '/filtering', label: 'Image Filtering', icon: Search, vol: 'I' },
    { href: '/features', label: 'Feature Points', icon: Layers, vol: 'II' },
    { href: '/camera-model', label: 'Camera Model', icon: Camera, vol: 'III' },
    { href: '/epipolar', label: 'Epipolar Geometry', icon: Globe, vol: 'IV' },
  ];

  return (
    <aside className="hidden md:flex w-72 bg-[#F8F7F4] border-r border-slate-200 flex-col h-full shrink-0 relative overflow-hidden">
      {/* Sidebar Texture Overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none grayscale" 
           style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/natural-paper.png")' }} />
      
      <div className="relative z-10 p-8 pt-12 border-b border-slate-200">
        <Link href="/" className="group block">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-6 h-px bg-indigo-900 group-hover:w-10 transition-all duration-500" />
            <span className="text-[10px] font-sans font-bold text-slate-400 tracking-[0.4em] uppercase">
              Interactive Lab
            </span>
          </div>
          <h1 className="text-2xl font-serif font-medium tracking-tight text-slate-900 leading-none">
            CV <span className="italic">Series</span>
          </h1>
        </Link>
      </div>

      <nav className="relative z-10 flex-1 p-6 space-y-8 overflow-y-auto mt-4">
        <div>
          <span className="text-[9px] font-sans font-bold text-slate-300 uppercase tracking-[0.3em] ml-2 block mb-6">
            Module Index
          </span>
          <div className="space-y-1">
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link 
                  key={link.href}
                  href={link.href}
                  className={`flex items-center justify-between px-3 py-3 group transition-all duration-300 rounded-sm ${
                    isActive ? 'bg-white shadow-sm border border-slate-100' : 'hover:translate-x-1'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <link.icon size={16} strokeWidth={1.5} className={`${isActive ? 'text-indigo-900' : 'text-slate-300 group-hover:text-slate-500'} transition-colors`} />
                    <span className={`text-[13px] font-serif ${isActive ? 'text-indigo-900 font-medium' : 'text-slate-600 group-hover:text-slate-900'} transition-colors`}>
                      {link.label}
                    </span>
                  </div>
                  {link.vol && (
                    <span className={`text-[9px] font-sans font-bold transition-colors ${isActive ? 'text-indigo-900/40' : 'text-slate-200'}`}>
                      {link.vol}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      <div className="relative z-10 p-8 border-t border-slate-200">
        <div className="flex items-center gap-3 text-slate-300 mb-4">
          <BookOpen size={14} />
          <span className="text-[9px] font-sans font-bold uppercase tracking-[0.2em]">Curated Series</span>
        </div>
        <div className="text-[9px] font-serif italic text-slate-400 leading-relaxed">
          A physical exploration of vision principles. <br />
          Volume I — Edition 2026
        </div>
      </div>
    </aside>
  );
}
