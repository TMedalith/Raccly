'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  BarChart3,
  Table2,
  Clock,
  Map,
  Settings,
  User,
  Plus,
} from 'lucide-react';
import { ConversationList } from '@/features/conversations/components/ConversationList';
import { useConversations } from '@/features/conversations/hooks/useConversations';

const navigationItems = [
  { icon: MessageSquare, label: 'Chat', path: '/chat' },
  { icon: BarChart3, label: 'Comparar', path: '/compare' },
  { icon: Table2, label: 'Tabla', path: '/table' },
  { icon: Clock, label: 'Timeline', path: '/timeline' },
  { icon: Map, label: 'Mapa', path: '/map' },
];

export function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const { createConversation } = useConversations();
  const [isCreating, setIsCreating] = useState(false);

  const handleNewConversation = async () => {
    setIsCreating(true);
    const newConversation = await createConversation('Nueva conversación');
    if (newConversation) {
      router.push(`/chat/${newConversation.id}`);
    }
    setIsCreating(false);
  };

  const isActive = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  };

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-[260px] h-screen bg-white border-r border-[#FFD9D0] flex flex-col p-4 gap-4"
    >
      {}
      <div className="space-y-3">
        {}
        <div className="flex items-center gap-2 px-2">
          <span className="text-2xl">🔬</span>
          <h1 className="text-lg font-semibold text-[#4A4A4A]">Memora Lab</h1>
        </div>

        {}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleNewConversation}
          disabled={isCreating}
          className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFB5A7] text-[#4A4A4A] rounded-lg font-medium shadow-sm hover:bg-[#FF8B7A] hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-4 h-4" />
          {isCreating ? 'Creando...' : 'Nueva Conversación'}
        </motion.button>
      </div>

      {}
      <nav className="space-y-1">
        {navigationItems.map((item, index) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <motion.button
              key={item.path}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.03 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                active
                  ? 'bg-[#FFF0ED] text-[#FF8B7A]'
                  : 'text-[#9E9E9E] hover:bg-[#FFF0ED]/50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </motion.button>
          );
        })}
      </nav>

      {}
      <div className="h-px bg-[#FFD9D0]/50" />

      {}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-sm font-semibold text-[#9E9E9E] mb-3 px-2 flex items-center gap-2">
         
          Recientes
        </h2>
        <div className="flex-1 overflow-y-auto">
          <ConversationList />
        </div>
      </div>

      {}
      <div className="h-px bg-[#FFD9D0]/50" />

      {}
      <div className="space-y-1">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2 text-[#9E9E9E] hover:bg-[#FFF0ED]/50 rounded-lg transition-all"
        >
          <Settings className="w-4 h-4" />
          <span className="text-sm">Configuración</span>
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full flex items-center gap-3 px-3 py-2 text-[#9E9E9E] hover:bg-[#FFF0ED]/50 rounded-lg transition-all"
        >
          <User className="w-4 h-4" />
          <span className="text-sm">Usuario</span>
        </motion.button>
      </div>
    </motion.aside>
  );
}
