'use client';
import React, { useState, useEffect } from 'react';
import { Search, Layers, Camera, Globe } from 'lucide-react';
import { CentralViewport } from '@/components/landing/CentralViewport';
import { ModuleStation } from '@/components/landing/ModuleStation';
import { DiagnosticHUD } from '@/components/landing/DiagnosticHUD';

export default function Home() {
  const [mode, setMode] = useState('default');
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: e.clientX,
        y: e.clientY
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="space-y-16 pb-20">
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center gap-4 mb-2">
          <div className="h-px w-8 bg-slate-300" />
          <span className="text-[10px] font-sans font-bold text-slate-400 tracking-[0.4em] uppercase">
            Interactive Series · Vol. 01
          </span>
          <div className="h-px w-8 bg-slate-300" />
        </div>
        <h1 className="text-6xl md:text-7xl font-medium tracking-tight text-slate-900">
          Computer Vision <span className="italic font-serif text-indigo-900">Interactive</span> Lab
        </h1>
        <p className="font-sans text-xs text-slate-500 uppercase tracking-[0.5em] max-w-lg mx-auto leading-relaxed border-t border-slate-200 pt-4">
          A Curated Exploration of Visual Geometry & Signal Processing
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 items-center">
        <div className="lg:col-span-1 space-y-4">
          <ModuleStation 
            id="filtering" title="Image Filtering" icon={Search} 
            description="L_01: SPATIAL CONVOLUTION" onHover={setMode} 
          />
          <ModuleStation 
            id="features" title="Feature Points" icon={Layers} 
            description="L_02: GRADIENT ANALYSIS" onHover={setMode} 
          />
        </div>

        <div className="lg:col-span-2">
          <CentralViewport mode={mode} />
        </div>

        <div className="lg:col-span-1 space-y-4">
          <ModuleStation 
            id="camera" title="Camera Model" icon={Camera} 
            description="L_03: PINHOLE PROJECTION" onHover={setMode} 
          />
          <ModuleStation 
            id="epipolar" title="Epipolar Geometry" icon={Globe} 
            description="L_04: STEREO CORRESPONDENCE" onHover={setMode} 
          />
        </div>
      </div>
      
      <DiagnosticHUD mousePos={mousePos} mode={mode} />
    </div>
  );
}
