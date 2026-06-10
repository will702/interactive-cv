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
      <div>
        <div className="flex items-end justify-between gap-8">
          <h1 className="font-serif font-medium leading-[0.9] tracking-[-0.03em] text-slate-900 [text-wrap:balance]">
            <span className="block text-[clamp(2.25rem,6vw,5.5rem)]">Computer Vision</span>
            <span className="block text-[clamp(2.25rem,6vw,5.5rem)] italic text-slate-900">Interactive Lab</span>
          </h1>
          <div className="hidden md:block shrink-0 text-right self-end pb-1">
            <p className="font-mono text-[8px] font-bold text-slate-300 tracking-[0.15em] leading-loose uppercase">
              CV_LAB.001<br />Series I · 2026
            </p>
          </div>
        </div>
        <p className="mt-8 font-serif text-lg text-slate-500 leading-relaxed max-w-2xl">
          Visual geometry and signal processing — made interactive.
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
