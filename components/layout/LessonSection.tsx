import React from 'react';

interface LessonSectionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

export function LessonSection({ title, children }: LessonSectionProps) {
  return (
    <section className="mb-24 max-w-4xl">
      {title && (
        <div className="mb-10">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-px w-6 bg-indigo-900/20" />
             <span className="text-[9px] font-sans font-bold text-slate-400 uppercase tracking-[0.3em]">
               Curriculum Segment
             </span>
          </div>
          <h2 className="text-4xl font-serif font-medium tracking-tight text-slate-900 italic leading-tight">
            {title}
          </h2>
          <div className="h-px w-full bg-gradient-to-r from-slate-200 via-slate-100 to-transparent mt-8" />
        </div>
      )}
      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed text-lg font-serif selection:bg-indigo-100">
        {children}
      </div>
    </section>
  );
}
