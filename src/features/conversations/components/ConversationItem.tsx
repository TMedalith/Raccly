'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MoreVertical, Trash2 } from 'lucide-react';
import type { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  onDelete: (id: string) => void;
}

const colorMap = {
  lavender: 'bg-[#FFB5A7]',
  mint: 'bg-[#FFB5A7]',
  peach: 'bg-[#FFB5A7]',
  pink: 'bg-[#FFB5A7]',
  sky: 'bg-[#FFB5A7]',
};

export function ConversationItem({
  conversation,
  onDelete,
}: ConversationItemProps) {
  const router = useRouter();
  const [showOptions, setShowOptions] = useState(false);

  const handleClick = () => {
    router.push(`/chat/${conversation.id}`);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('¿Eliminar esta conversación?')) {
      onDelete(conversation.id);
    }
    setShowOptions(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="relative group"
    >
      <div
        onClick={handleClick}
        onMouseEnter={() => setShowOptions(true)}
        onMouseLeave={() => setShowOptions(false)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all hover:bg-[#FFF0ED]"
      >
        <div className={`w-2 h-2 rounded-full flex-shrink-0 ${colorMap[conversation.color]}`} />

        <span className="flex-1 text-sm text-[#4A4A4A] truncate">
          {conversation.title}
        </span>

        {showOptions && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => {
              e.stopPropagation();
              setShowOptions(true);
            }}
            className="flex-shrink-0 p-1 hover:bg-[#FFF0ED] rounded transition-colors"
          >
            <MoreVertical className="w-4 h-4 text-[#9E9E9E]" />
          </motion.button>
        )}
      </div>

      {showOptions && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          onMouseEnter={() => setShowOptions(true)}
          onMouseLeave={() => setShowOptions(false)}
          className="absolute right-2 top-10 bg-white border border-[#FFD9D0] rounded-lg shadow-lg py-1 z-10 min-w-[140px]"
        >
          <button
            onClick={handleDelete}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-[#FF6B6B] hover:bg-[#FFF0ED] transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Eliminar
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}
