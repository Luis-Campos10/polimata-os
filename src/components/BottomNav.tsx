'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Compass, PlusCircle, BookOpen, User } from 'lucide-react';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Hoy', icon: Calendar },
    { href: '/ruta', label: 'Ruta', icon: Compass },
    { href: '/nuevo', label: '+', icon: PlusCircle, isAction: true },
    { href: '/saber', label: 'Saber', icon: BookOpen },
    { href: '/yo', label: 'Yo', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/95 backdrop-blur border-t border-slate-800 px-4 py-2">
      <div className="max-w-md mx-auto flex justify-between items-center">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
          const Icon = item.icon;

          if (item.isAction) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center -mt-5 bg-sky-600 hover:bg-sky-500 text-white p-3 rounded-full shadow-lg shadow-sky-900/50 transition-all transform active:scale-95"
              >
                <Icon className="w-6 h-6" />
                <span className="sr-only">Nuevo</span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center py-1 px-3 rounded-lg text-xs font-medium transition-colors ${
                isActive ? 'text-sky-400 bg-slate-800/60' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon className="w-5 h-5 mb-1" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
