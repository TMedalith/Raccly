'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Search, BarChart3, Table, Map as MapIcon, TrendingUp } from 'lucide-react';

const navigationItems = [
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: Search, label: 'Explore', path: '/explore' },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics' },
  { icon: MapIcon, label: 'Map', path: '/map' },
  { icon: Table, label: 'Table', path: '/table' },
  { icon: BarChart3, label: 'Graphs', path: '/graphs' },
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/chat') return pathname === '/chat' || pathname.startsWith('/chat/');
    return pathname.startsWith(path);
  };

  return (
    <nav className="bg-white border-b border-[var(--border)] shadow-sm">
      <div className="max-w-[1800px] mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
                    <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <span className="text-2xl">🔬</span>
            <h1 className="text-lg font-bold text-[var(--foreground)]">Memora Lab</h1>
          </button>

                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-medium text-sm ${
                    active
                      ? 'bg-[var(--primary)] text-white shadow-md'
                      : 'text-[var(--muted-foreground)] hover:bg-[var(--secondary)]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </motion.button>
              );
            })}
          </div>

                    <div className="w-[140px]"></div>
        </div>
      </div>
    </nav>
  );
}
