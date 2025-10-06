'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface MemoraLabLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function MemoraLabLogo({ size = 40, showText = false, className = '' }: MemoraLabLogoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, rotate: -10 }}
      animate={{ opacity: 1, rotate: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05, rotate: 5 }}
      className={`flex-shrink-0 ${className}`}
    >
      <Image
        src="/logo.png"
        alt="Memora Lab"
        width={size}
        height={size}
        className="object-contain"
        priority
      />
    </motion.div>
  );
}

// Compact version for navbar
export function CompactMemoraLogo({ size = 50 }: { size?: number }) {
  return (
    <motion.div
      whileHover={{ scale: 1.15, rotate: 5 }}
      transition={{ duration: 0.3, type: "spring" }}
      className="flex-shrink-0 relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-xl"></div>
      <Image
        src="/logo.png"
        alt="Memora Lab"
        width={size}
        height={size}
        className="object-contain relative z-10 drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]"
        priority
      />
    </motion.div>
  );
}
