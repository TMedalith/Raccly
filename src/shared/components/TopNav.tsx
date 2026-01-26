'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Search, Network, Home } from 'lucide-react';
import { OwlLogo } from './OwlIcons';

const navigationItems = [
  { label: 'Chat', path: '/chat', icon: MessageSquare },
  { label: 'Explore', path: '/explore', icon: Search },
  { label: 'Network', path: '/network', icon: Network },
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    if (path === '/chat') return pathname === '/chat' || pathname.startsWith('/chat/');
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <nav className="fixed left-0 top-0 bottom-0 z-50 w-20 bg-white border-r-2 border-slate-900 flex flex-col items-center py-6">
      {/* Logo arriba */}
      <motion.button
        onClick={() => router.push('/')}
        className="mb-8 hover:scale-110 transition-transform"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        <OwlLogo className="w-12 h-12" />
      </motion.button>

      {/* Navegación vertical */}
      <div className="flex-1 flex flex-col gap-2 w-full px-2">
        {navigationItems.map((item, index) => {
          const active = isActive(item.path);
          const Icon = item.icon;

          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleNavigation(item.path)}
              className={`relative group w-full h-14 rounded-xl flex items-center justify-center transition-all ${
                active
                  ? 'bg-[#d4f78a] text-slate-900 border-2 border-slate-900'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              title={item.label}
            >
              <Icon className="w-6 h-6" />
              
              {/* Tooltip al hacer hover */}
              <div className="absolute left-full ml-2 px-3 py-2 bg-white text-slate-900 text-sm font-medium rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap border-2 border-slate-900 font-[family-name:var(--font-space-grotesk)]">
                {item.label}
              </div>

              {/* Indicador activo */}
              {active && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-slate-900 rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Footer - puede ser perfil o settings */}
      <div className="mt-auto">
        <div className="w-12 h-12 rounded-full bg-[#d4f78a] border-2 border-slate-900 flex items-center justify-center text-slate-900 font-bold font-[family-name:var(--font-space-grotesk)]">
          R
        </div>
      </div>
    </nav>
  );
}
