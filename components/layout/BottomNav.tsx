import Link from 'next/link';
import { Home, Search, Camera, Globe } from 'lucide-react';

export function BottomNav() {
  const links = [
    { href: '/', label: 'Index', icon: Home },
    { href: '/filtering', label: 'Filtering', icon: Search },
    { href: '/camera-model', label: 'Camera', icon: Camera },
    { href: '/epipolar', label: 'Stereo', icon: Globe },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/90 backdrop-blur-xl border-t border-slate-200 flex md:hidden items-center justify-around z-50 px-6 pb-2 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.05)] rounded-t-xl">
      {links.map((link) => (
        <Link 
          key={link.href} 
          href={link.href} 
          className="flex flex-col items-center gap-2 text-slate-400 hover:text-indigo-900 transition-all duration-300"
        >
          <link.icon size={18} strokeWidth={1.5} />
          <span className="text-[8px] font-sans font-bold uppercase tracking-[0.2em]">{link.label}</span>
        </Link>
      ))}
    </nav>
  );
}
