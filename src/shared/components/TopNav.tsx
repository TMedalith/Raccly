'use client';

import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAudio } from '@/shared/hooks/useAudio';

const navigationItems = [
  { label: 'CHAT', path: '/chat', audio: ['Help Phrases1 .mp3', 'voice commands.mp3'] },
  { label: 'EXPLORE', path: '/explore', audio: ['On your le.mp3', 'In the cen.mp3'] },
  { label: 'ANALYTICS', path: '/analytics', audio: ['On the rig.mp3'] },
  { label: 'MAP', path: '/map', audio: ['At the bot.mp3'] },
  { label: 'TABLE', path: '/table', audio: [] },
  { label: 'GRAPHS', path: '/graphs', audio: ['My purpose.mp3'] },
];

export function TopNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { play, stop } = useAudio();

  const isActive = (path: string) => {
    if (path === '/chat') return pathname === '/chat' || pathname.startsWith('/chat/');
    return pathname.startsWith(path);
  };

  const handleNavigation = (path: string, audio: string[]) => {
    // Primero detener cualquier audio existente
    stop();

    // Iniciar la navegación inmediatamente
    router.push(path);
    
    // Reproducir el audio después
    if (audio.length > 0) {
      play(audio);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="max-w-[1800px] mx-auto px-8 py-6">
        <div className="flex items-center justify-between">
          {/* Logo a la izquierda */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl font-bold text-white tracking-wide font-[family-name:var(--font-space-grotesk)]">
              MEMORALAB
            </div>
          </button>

          {/* Items centrados */}
          <div className="absolute left-1/2 transform -translate-x-1/2 hidden lg:flex items-center gap-10">
            {navigationItems.map((item, index) => {
              const active = isActive(item.path);

              return (
                <motion.button
                  key={item.path}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleNavigation(item.path, item.audio)}
                  className="relative group"
                >
                  <span className={`text-sm font-medium tracking-wider transition-colors ${
                    active
                      ? 'text-white'
                      : 'text-white/70 hover:text-white'
                  }`}>
                    {item.label}
                  </span>
                  {/* Underline cuando está activo */}
                  {active && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-white"
                      initial={false}
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>

          {/* Espacio a la derecha para balance */}
          <div className="w-[120px]"></div>
        </div>
      </div>
    </nav>
  );
}
