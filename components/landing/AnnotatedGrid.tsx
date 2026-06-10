'use client';
import React, { useState } from 'react';

export default function AnnotatedGrid() {
  const [gridData] = useState<{hex: string, val: number}[]>(() => 
    Array.from({ length: 144 }).map(() => ({
      hex: Math.floor(Math.random() * 255).toString(16).padStart(2, '0'),
      val: Math.floor(Math.random() * 9)
    }))
  );

  return (
    <div className="grid grid-cols-12 gap-4 p-8 opacity-40 font-mono text-[7px] text-indigo-900 w-full h-full">
      {gridData.map((item, i) => (
        <div key={i} className="flex flex-col items-center">
          <span>{item.hex}</span>
          <span className="opacity-40 text-[5px]">{item.val}</span>
        </div>
      ))}
    </div>
  );
}
