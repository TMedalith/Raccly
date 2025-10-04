'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MessageSquare } from 'lucide-react';
import type { Conversation } from '../types';

interface ConversationItemProps {
  conversation: Conversation;
  onDelete: (id: string) => void;
}

export function ConversationItem({
  conversation,
}: ConversationItemProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/chat?session=${conversation.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ x: 4 }}
      className="cursor-pointer"
    >
      <div
        onClick={handleClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all hover:bg-[var(--secondary)] group"
      >
        <MessageSquare className="w-4 h-4 text-[var(--muted-foreground)] flex-shrink-0" />

        <span className="flex-1 text-sm text-[var(--foreground)] truncate">
          {conversation.title}
        </span>
      </div>
    </motion.div>
  );
}
