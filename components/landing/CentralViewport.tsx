'use client';
import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Line } from '@react-three/drei';
import * as THREE from 'three';

import dynamic from 'next/dynamic';

const AnnotatedGrid = dynamic(() => import('./AnnotatedGrid'), { ssr: false });

// --- 3D Scene Components ---

function DataCore() {
  const meshRef = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.15} />
      </mesh>
      <points>
        <icosahedronGeometry args={[2.05, 2]} />
        <pointsMaterial color="#0f172a" size={0.03} transparent opacity={0.4} />
      </points>
    </Float>
  );
}

function FilteringGrid({ mousePos }: { mousePos: { x: number, y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  const rows = 12;
  const cols = 12;
  
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.x = 0.2 + (mousePos.y / 600 - 0.5) * 0.2;
      groupRef.current.rotation.y = (mousePos.x / 800 - 0.5) * 0.2;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: rows }).map((_, i) => 
        Array.from({ length: cols }).map((_, j) => (
          <mesh key={`${i}-${j}`} position={[i - rows/2, j - cols/2, 0]}>
            <boxGeometry args={[0.9, 0.9, 0.05]} />
            <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.1} />
          </mesh>
        ))
      )}
    </group>
  );
}

function FeatureConstellation({ mousePos }: { mousePos: { x: number, y: number } }) {
  const [points] = useState<THREE.Vector3[]>(() => {
    const p = [];
    for (let i = 0; i < 40; i++) {
      p.push(new THREE.Vector3(
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 12,
        (Math.random() - 0.5) * 4
      ));
    }
    return p;
  });

  const target = new THREE.Vector3(
    (mousePos.x / 800 - 0.5) * 12,
    -(mousePos.y / 600 - 0.5) * 12,
    0
  );

  return (
    <group>
      {points.map((p, i) => (
        <group key={i} position={p}>
          <mesh>
            <sphereGeometry args={[0.04, 6, 6]} />
            <meshBasicMaterial color="#0f172a" transparent opacity={0.6} />
          </mesh>
          <Line 
            points={[new THREE.Vector3(0,0,0), target.clone().sub(p)]} 
            color="#1e3a8a" 
            lineWidth={0.5} 
            transparent 
            opacity={0.05} 
          />
        </group>
      ))}
    </group>
  );
}

function CameraFrustum({ mousePos }: { mousePos: { x: number, y: number } }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (groupRef.current) {
      const targetX = (mousePos.x / 800 - 0.5) * 4;
      const targetY = -(mousePos.y / 600 - 0.5) * 4;
      groupRef.current.lookAt(targetX, targetY, 4);
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -4]}>
      {/* Camera Body */}
      <mesh>
        <boxGeometry args={[1.2, 0.9, 1.4]} />
        <meshBasicMaterial color="#1e3a8a" wireframe opacity={0.3} transparent />
      </mesh>
      {/* Frustum Lines */}
      <Line points={[[0, 0, 0], [-2.5, -1.8, 6]]} color="#0f172a" lineWidth={0.8} transparent opacity={0.4} />
      <Line points={[[0, 0, 0], [2.5, -1.8, 6]]} color="#0f172a" lineWidth={0.8} transparent opacity={0.4} />
      <Line points={[[0, 0, 0], [-2.5, 1.8, 6]]} color="#0f172a" lineWidth={0.8} transparent opacity={0.4} />
      <Line points={[[0, 0, 0], [2.5, 1.8, 6]]} color="#0f172a" lineWidth={0.8} transparent opacity={0.4} />
      {/* Image Plane */}
      <mesh position={[0, 0, 6]}>
        <planeGeometry args={[5, 3.6]} />
        <meshBasicMaterial color="#1e3a8a" wireframe transparent opacity={0.1} />
      </mesh>
    </group>
  );
}

// --- Main Component ---

export function CentralViewport({ mode }: { mode: string }) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const render3DContent = () => {
    switch (mode) {
      case 'filtering': return <FilteringGrid mousePos={mousePos} />;
      case 'features': return <FeatureConstellation mousePos={mousePos} />;
      case 'camera': return <CameraFrustum mousePos={mousePos} />;
      case 'epipolar': return (
        <group>
          <group position={[-2.5, 0, 0]}><CameraFrustum mousePos={mousePos} /></group>
          <group position={[2.5, 0, 0]}><CameraFrustum mousePos={mousePos} /></group>
        </group>
      );
      default: return <DataCore />;
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-[600px] bg-white border border-slate-200 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden group cursor-crosshair rounded-sm">
      {/* Base 3D Layer */}
      <div className="absolute inset-0 z-0">
        <Canvas gl={{ alpha: true }}>
          <PerspectiveCamera makeDefault position={[0, 0, 12]} fov={45} />
          <ambientLight intensity={1} />
          {render3DContent()}
        </Canvas>
      </div>

      {/* Technical Annotation Overlay (2D) */}
      <div className="absolute inset-0 z-10 pointer-events-none p-12">
         {/* Minimal Corner Brackets */}
         <div className="absolute top-8 left-8 w-6 h-6 border-t border-l border-slate-300" />
         <div className="absolute top-8 right-8 w-6 h-6 border-t border-r border-slate-300" />
         <div className="absolute bottom-8 left-8 w-6 h-6 border-b border-l border-slate-300" />
         <div className="absolute bottom-8 right-8 w-6 h-6 border-b border-r border-slate-300" />
         
         <div className="absolute top-8 left-16 font-sans text-[8px] font-bold text-slate-400 uppercase tracking-[0.3em]">
           Plate_{mode.toUpperCase()} {'//'} Fig. 1.2
         </div>
      </div>

      {/* Interactive Detail Reveal (Magnifier) */}
      <div 
        className="absolute inset-0 z-20 select-none pointer-events-none"
        style={{ 
          clipPath: `circle(80px at ${mousePos.x}px ${mousePos.y}px)`,
        }}
      >
         <div className="absolute inset-0 bg-indigo-950/5 backdrop-blur-[1px] border border-indigo-900/20 rounded-full" />
         
         <AnnotatedGrid />

         <div 
           className="absolute font-sans text-[7px] font-bold text-indigo-900 uppercase tracking-widest bg-white/90 px-2 py-1 border border-indigo-900/20 shadow-sm"
           style={{ left: mousePos.x + 20, top: mousePos.y + 20 }}
         >
           COORDS: [{Math.round(mousePos.x)}, {Math.round(mousePos.y)}]
         </div>
      </div>

      {/* Mode Badge - Minimalist */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 z-40 pointer-events-none">
        <div className="px-5 py-2 bg-white border border-slate-200 text-[10px] font-serif italic text-slate-900 tracking-wide flex items-center gap-4 shadow-sm">
          {mode.charAt(0).toUpperCase() + mode.slice(1)} Principles
        </div>
      </div>
    </div>
  );
}
