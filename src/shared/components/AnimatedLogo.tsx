'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface AnimatedLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

export function AnimatedLogo({ size = 120, showText = true, className = '' }: AnimatedLogoProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`flex items-center gap-4 ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Logo SVG Animado */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Gradientes */}
          <defs>
            <linearGradient id="orbitGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#1e3a8a" stopOpacity="0.8" />
            </linearGradient>
            
            <linearGradient id="coreGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>

            <radialGradient id="glowGradient">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </radialGradient>

            {/* Filtro de brillo */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Círculo de resplandor de fondo */}
          <motion.circle
            cx="60"
            cy="60"
            r="50"
            fill="url(#glowGradient)"
            animate={{
              scale: isHovered ? [1, 1.1, 1] : 1,
              opacity: isHovered ? [0.3, 0.5, 0.3] : 0.2,
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Órbita exterior 1 */}
          <motion.ellipse
            cx="60"
            cy="60"
            rx="45"
            ry="45"
            stroke="url(#orbitGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="4 4"
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ originX: '60px', originY: '60px' }}
          />

          {/* Órbita exterior 2 - inclinada */}
          <motion.ellipse
            cx="60"
            cy="60"
            rx="38"
            ry="45"
            stroke="url(#orbitGradient)"
            strokeWidth="1.5"
            fill="none"
            strokeDasharray="3 3"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ originX: '60px', originY: '60px' }}
          />

          {/* Órbita interna */}
          <motion.circle
            cx="60"
            cy="60"
            r="30"
            stroke="#60a5fa"
            strokeWidth="1"
            fill="none"
            strokeDasharray="2 3"
            animate={{
              rotate: 360,
              strokeOpacity: [0.3, 0.7, 0.3],
            }}
            transition={{
              rotate: {
                duration: 6,
                repeat: Infinity,
                ease: "linear"
              },
              strokeOpacity: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }
            }}
            style={{ originX: '60px', originY: '60px' }}
          />

          {/* Núcleo central - átomo */}
          <motion.circle
            cx="60"
            cy="60"
            r="12"
            fill="url(#coreGradient)"
            filter="url(#glow)"
            animate={{
              scale: isHovered ? [1, 1.15, 1] : [1, 1.05, 1],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Anillos internos del núcleo */}
          <motion.circle
            cx="60"
            cy="60"
            r="8"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.6"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.6, 0.3, 0.6],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Partículas orbitales */}
          {[0, 120, 240].map((angle, index) => (
            <motion.circle
              key={`particle-outer-${index}`}
              cx="60"
              cy="60"
              r="3"
              fill="#60a5fa"
              filter="url(#glow)"
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: index * 2.67 / 3,
              }}
              style={{ 
                originX: '60px', 
                originY: '60px',
                translateX: `${45 * Math.cos((angle * Math.PI) / 180)}px`,
                translateY: `${45 * Math.sin((angle * Math.PI) / 180)}px`,
              }}
            />
          ))}

          {/* Partículas internas */}
          {[60, 180, 300].map((angle, index) => (
            <motion.circle
              key={`particle-inner-${index}`}
              cx="60"
              cy="60"
              r="2.5"
              fill="#93c5fd"
              filter="url(#glow)"
              animate={{
                rotate: -360,
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "linear",
                delay: index * 2 / 3,
              }}
              style={{ 
                originX: '60px', 
                originY: '60px',
                translateX: `${30 * Math.cos((angle * Math.PI) / 180)}px`,
                translateY: `${30 * Math.sin((angle * Math.PI) / 180)}px`,
              }}
            />
          ))}

          {/* Líneas de conexión de datos (efecto DNA) */}
          <motion.line
            x1="60"
            y1="20"
            x2="60"
            y2="100"
            stroke="#3b82f6"
            strokeWidth="0.5"
            strokeDasharray="2 2"
            opacity="0.3"
            animate={{
              strokeDashoffset: [0, -20],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          {/* Destellos periódicos */}
          <motion.circle
            cx="60"
            cy="60"
            r="6"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            animate={{
              scale: [0, 2],
              opacity: [1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeOut",
            }}
          />
        </svg>
      </div>

      {/* Texto del logo */}
      {showText && (
        <div className="flex flex-col">
          <motion.h1
            className="text-2xl font-bold bg-gradient-to-r from-[#1e3a8a] to-[#3b82f6] bg-clip-text text-transparent"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            Memora Lab
          </motion.h1>
          <motion.p
            className="text-xs text-gray-600 tracking-wider"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Research & Innovation
          </motion.p>
        </div>
      )}
    </div>
  );
}

// Variante compacta para navbar
export function CompactLogo({ size = 40 }: { size?: number }) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox="0 0 120 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="compactGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
        </defs>

        {/* Órbita simple */}
        <motion.circle
          cx="60"
          cy="60"
          r="45"
          stroke="url(#compactGradient)"
          strokeWidth="2"
          fill="none"
          strokeDasharray="4 4"
          animate={{ rotate: 360 }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          style={{ originX: '60px', originY: '60px' }}
        />

        {/* Núcleo */}
        <motion.circle
          cx="60"
          cy="60"
          r="12"
          fill="url(#compactGradient)"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Partículas */}
        {[0, 120, 240].map((angle, index) => (
          <motion.circle
            key={index}
            cx="60"
            cy="60"
            r="3"
            fill="#60a5fa"
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
              delay: index * 2.67 / 3,
            }}
            style={{ 
              originX: '60px', 
              originY: '60px',
              translateX: `${45 * Math.cos((angle * Math.PI) / 180)}px`,
              translateY: `${45 * Math.sin((angle * Math.PI) / 180)}px`,
            }}
          />
        ))}
      </svg>
    </div>
  );
}

// Variante de carga/loading
export function LoadingLogo({ size = 60 }: { size?: number }) {
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-blue-600"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.2, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="relative w-3/4 h-3/4 rounded-full bg-gradient-to-br from-blue-500 to-blue-700"
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      >
        <div className="absolute top-1/2 left-1/2 w-2 h-2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full" />
      </motion.div>
    </div>
  );
}
