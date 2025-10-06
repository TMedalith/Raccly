'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare, Search, BarChart3, Table, Map as MapIcon, TrendingUp } from 'lucide-react';
import { useAudio } from '@/shared/hooks/useAudio';
import { CompactMemoraLogo } from '@/shared/components/MemoraLabLogo';

const navigationItems = [
  { icon: MessageSquare, label: 'Chat', path: '/chat', audio: ['Help Phrases1 .mp3', 'voice commands.mp3'] },
  { icon: Search, label: 'Explore', path: '/explore', audio: ['On your le.mp3', 'In the cen.mp3'] },
  { icon: TrendingUp, label: 'Analytics', path: '/analytics', audio: ['On the rig.mp3'] },
  { icon: MapIcon, label: 'Map', path: '/map', audio: ['At the bot.mp3'] },
  { icon: Table, label: 'Table', path: '/table', audio: [] },
  { icon: BarChart3, label: 'Graphs', path: '/graphs', audio: ['My purpose.mp3'] },
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { play } = useAudio();

  const isActive = (path: string) => {
    if (path === '/chat') return pathname === '/chat' || pathname.startsWith('/chat/');
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string, audio: string[]) => {
    if (audio.length > 0) {
      play(audio);
    }
    router.push(path);
  };

  return (
    <nav className="bg-gradient-to-r from-[#0a0e27] via-[#0f1435] to-[#0a0e27] border-b border-white/10 shadow-xl backdrop-blur-xl">
      <div className="max-w-[1800px] mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center hover:scale-110 transition-transform duration-300"
          >
            <CompactMemoraLogo size={50} />
          </button>

                    <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
            {navigationItems.map((item, index) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.path, item.audio)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl transition-all font-medium text-sm ${
                    active
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/50'
                      : 'text-blue-200 hover:bg-white/10 hover:text-white'
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
