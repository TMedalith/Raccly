'use client';

import { motion } from 'framer-motion';

// Logo Raccoon - Diseño profesional estilo Duolingo (BOLD, SIMPLE, MEMORABLE)
// Mapache perfecto para investigación científica: curioso, inteligente, tierno
export const OwlLogo = ({ className = "w-8 h-8" }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.08 }}
    transition={{ type: "spring", stiffness: 300 }}
  >
    {/* Cabeza principal - gris claro */}
    <circle cx="50" cy="52" r="36" fill="#64748b" />
    
    {/* Orejas redondeadas */}
    <circle cx="28" cy="24" r="14" fill="#64748b" />
    <circle cx="72" cy="24" r="14" fill="#64748b" />
    <circle cx="28" cy="26" r="8" fill="#334155" />
    <circle cx="72" cy="26" r="8" fill="#334155" />
    
    {/* Antifaz característico del mapache - NEGRO */}
    <ellipse cx="50" cy="48" rx="32" ry="16" fill="#0f172a" />
    
    {/* Ojos GRANDES dentro del antifaz - blancos perfectos */}
    <circle cx="37" cy="48" r="11" fill="white" />
    <circle cx="63" cy="48" r="11" fill="white" />
    
    {/* Pupilas - parpadeo tierno */}
    <motion.circle 
      cx="37" 
      cy="48" 
      r="6" 
      fill="#0f172a"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
    />
    <motion.circle 
      cx="63" 
      cy="48" 
      r="6" 
      fill="#0f172a"
      animate={{ scaleY: [1, 0.1, 1] }}
      transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 }}
    />
    
    {/* Brillo en ojos */}
    <circle cx="39" cy="45" r="3" fill="white" />
    <circle cx="65" cy="45" r="3" fill="white" />
    
    {/* Nariz grande y tierna */}
    <ellipse cx="50" cy="66" rx="8" ry="7" fill="#0f172a" />
    <circle cx="48" cy="64" r="2" fill="white" opacity="0.6" />
    
    {/* Boca sonriente */}
    <path d="M50 70 Q45 74 42 72" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
    <path d="M50 70 Q55 74 58 72" stroke="#0f172a" strokeWidth="2" fill="none" strokeLinecap="round" />
  </motion.svg>
);

// Búho Chat - Para AI Chat Feature
export const OwlChat = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1, rotate: 5 }}
  >
    {/* Cuerpo */}
    <ellipse cx="60" cy="65" rx="40" ry="45" fill="url(#chatGradient)" />
    
    {/* Orejas */}
    <path d="M25 30 Q20 18, 15 25 L25 42 Z" fill="#3b82f6" />
    <path d="M95 30 Q100 18, 105 25 L95 42 Z" fill="#3b82f6" />
    
    {/* Cara blanca */}
    <ellipse cx="60" cy="55" rx="35" ry="30" fill="#e0f2fe" />
    
    {/* Ojos grandes con pestañas */}
    <g id="leftEye">
      <ellipse cx="45" cy="50" rx="14" ry="16" fill="white" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="45" cy="52" r="10" fill="black" />
      <circle cx="47" cy="49" r="4" fill="white" opacity="0.9" />
      {/* Pestañas */}
      <line x1="32" y1="42" x2="28" y2="38" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="40" x2="32" y2="35" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="39" x2="37" y2="33" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </g>
    
    <g id="rightEye">
      <ellipse cx="75" cy="50" rx="14" ry="16" fill="white" stroke="#cbd5e1" strokeWidth="2" />
      <circle cx="75" cy="52" r="10" fill="black" />
      <circle cx="77" cy="49" r="4" fill="white" opacity="0.9" />
      {/* Pestañas */}
      <line x1="88" y1="42" x2="92" y2="38" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="85" y1="40" x2="88" y2="35" stroke="black" strokeWidth="2" strokeLinecap="round" />
      <line x1="82" y1="39" x2="83" y2="33" stroke="black" strokeWidth="2" strokeLinecap="round" />
    </g>
    
    {/* Pico */}
    <path d="M60 62 L54 70 L66 70 Z" fill="#fbbf24" />
    
    {/* Burbujas de chat */}
    <motion.circle
      cx="95"
      cy="40"
      r="6"
      fill="#60a5fa"
      animate={{ y: [-2, 2, -2], opacity: [0.6, 1, 0.6] }}
      transition={{ duration: 2, repeat: Infinity }}
    />
    <motion.circle
      cx="105"
      cy="50"
      r="4"
      fill="#60a5fa"
      animate={{ y: [2, -2, 2], opacity: [1, 0.6, 1] }}
      transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
    />
    
    {/* Alas con plumas */}
    <g id="leftWing">
      <path d="M20 65 Q10 68, 12 78 C14 72, 18 70, 22 72 Z" fill="#60a5fa" />
      <path d="M18 70 Q12 72, 13 78" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
      <path d="M20 73 Q14 75, 15 80" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    </g>
    <g id="rightWing">
      <path d="M100 65 Q110 68, 108 78 C106 72, 102 70, 98 72 Z" fill="#60a5fa" />
      <path d="M102 70 Q108 72, 107 78" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
      <path d="M100 73 Q106 75, 105 80" stroke="#3b82f6" strokeWidth="1.5" fill="none" />
    </g>
    
    {/* Patas */}
    <ellipse cx="52" cy="105" rx="6" ry="7" fill="#f59e0b" />
    <ellipse cx="68" cy="105" rx="6" ry="7" fill="#f59e0b" />
    
    <defs>
      <linearGradient id="chatGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#60a5fa" />
        <stop offset="100%" stopColor="#3b82f6" />
      </linearGradient>
    </defs>
  </motion.svg>
);

// Búho Científico - Para Knowledge Graphs
export const OwlScientist = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1, rotate: -5 }}
  >
    {/* Cuerpo */}
    <ellipse cx="60" cy="68" rx="38" ry="42" fill="url(#scienceGradient)" />
    
    {/* Orejas */}
    <path d="M28 35 Q23 23, 18 28 L28 45 Z" fill="#059669" />
    <path d="M92 35 Q97 23, 102 28 L92 45 Z" fill="#059669" />
    
    {/* Cara */}
    <ellipse cx="60" cy="58" rx="32" ry="28" fill="#d1fae5" />
    
    {/* Gafas de científico */}
    <g id="glasses">
      {/* Montura izquierda */}
      <circle cx="45" cy="52" r="13" fill="white" stroke="#334155" strokeWidth="2.5" />
      <circle cx="45" cy="52" r="9" fill="black" />
      <circle cx="47" cy="50" r="3" fill="white" opacity="0.8" />
      
      {/* Montura derecha */}
      <circle cx="75" cy="52" r="13" fill="white" stroke="#334155" strokeWidth="2.5" />
      <circle cx="75" cy="52" r="9" fill="black" />
      <circle cx="77" cy="50" r="3" fill="white" opacity="0.8" />
      
      {/* Puente */}
      <line x1="58" y1="52" x2="62" y2="52" stroke="#334155" strokeWidth="2.5" />
      
      {/* Patillas */}
      <path d="M32 52 Q28 52, 26 50" stroke="#334155" strokeWidth="2" fill="none" />
      <path d="M88 52 Q92 52, 94 50" stroke="#334155" strokeWidth="2" fill="none" />
    </g>
    
    {/* Pico */}
    <path d="M60 62 L55 68 L65 68 Z" fill="#fbbf24" />
    
    {/* Plumas detalladas en alas */}
    <g id="leftWing">
      <path d="M22 68 Q15 70, 18 80 L28 75 Z" fill="#10b981" />
      <path d="M24 72 C22 74, 20 76, 21 78" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M26 75 C24 77, 22 79, 23 81" stroke="#059669" strokeWidth="1.5" fill="none" />
    </g>
    <g id="rightWing">
      <path d="M98 68 Q105 70, 102 80 L92 75 Z" fill="#10b981" />
      <path d="M96 72 C98 74, 100 76, 99 78" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M94 75 C96 77, 98 79, 97 81" stroke="#059669" strokeWidth="1.5" fill="none" />
    </g>
    
    {/* Nodos de red (tema conocimiento) */}
    <motion.g
      animate={{ opacity: [0.3, 0.7, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    >
      <circle cx="25" cy="55" r="2.5" fill="#059669" />
      <circle cx="95" cy="55" r="2.5" fill="#059669" />
      <circle cx="30" cy="45" r="2" fill="#10b981" />
      <circle cx="90" cy="45" r="2" fill="#10b981" />
      <line x1="25" y1="55" x2="30" y2="45" stroke="#10b981" strokeWidth="1" opacity="0.5" />
      <line x1="95" y1="55" x2="90" y2="45" stroke="#10b981" strokeWidth="1" opacity="0.5" />
    </motion.g>
    
    {/* Pecho con plumas */}
    <ellipse cx="60" cy="80" rx="18" ry="22" fill="#a7f3d0" />
    <path d="M50 75 Q60 78, 70 75" stroke="#059669" strokeWidth="1" fill="none" />
    <path d="M50 80 Q60 83, 70 80" stroke="#059669" strokeWidth="1" fill="none" />
    <path d="M50 85 Q60 88, 70 85" stroke="#059669" strokeWidth="1" fill="none" />
    
    {/* Patas */}
    <ellipse cx="52" cy="108" rx="5" ry="6" fill="#f59e0b" />
    <ellipse cx="68" cy="108" rx="5" ry="6" fill="#f59e0b" />
    
    <defs>
      <linearGradient id="scienceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="100%" stopColor="#059669" />
      </linearGradient>
    </defs>
  </motion.svg>
);

// Búho Astronauta - Para Mission Planning
export const OwlAstronaut = ({ className = "w-16 h-16" }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 120 120"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    whileHover={{ scale: 1.1, y: -5 }}
  >
    {/* Cuerpo */}
    <ellipse cx="60" cy="70" rx="36" ry="40" fill="url(#spaceGradient)" />
    
    {/* Casco espacial */}
    <g id="helmet">
      {/* Visor */}
      <ellipse cx="60" cy="50" rx="28" ry="30" fill="rgba(139, 92, 246, 0.2)" stroke="#8b5cf6" strokeWidth="3" />
      <ellipse cx="60" cy="50" rx="24" ry="26" fill="rgba(196, 181, 253, 0.3)" />
      
      {/* Reflejo del visor */}
      <motion.ellipse
        cx="48"
        cy="42"
        rx="8"
        ry="12"
        fill="white"
        opacity="0.4"
        animate={{ opacity: [0.2, 0.6, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </g>
    
    {/* Ojos dentro del casco */}
    <g id="eyes">
      <ellipse cx="48" cy="48" rx="10" ry="12" fill="white" />
      <circle cx="48" cy="50" r="7" fill="black" />
      <circle cx="50" cy="48" r="2.5" fill="white" />
      
      <ellipse cx="72" cy="48" rx="10" ry="12" fill="white" />
      <circle cx="72" cy="50" r="7" fill="black" />
      <circle cx="74" cy="48" r="2.5" fill="white" />
    </g>
    
    {/* Pico visible */}
    <path d="M60 56 L56 62 L64 62 Z" fill="#fbbf24" />
    
    {/* Detalles del traje espacial */}
    <g id="suitDetails">
      {/* Panel de control en pecho */}
      <rect x="50" y="75" width="20" height="15" rx="2" fill="#4c1d95" stroke="#8b5cf6" strokeWidth="1" />
      <circle cx="55" cy="82" r="2" fill="#10b981" />
      <circle cx="60" cy="82" r="2" fill="#fbbf24" />
      <circle cx="65" cy="82" r="2" fill="#ef4444" />
      
      {/* Líneas del traje */}
      <line x1="60" y1="90" x2="60" y2="105" stroke="#8b5cf6" strokeWidth="2" />
    </g>
    
    {/* Alas espaciales */}
    <path d="M24 70 Q18 72, 20 82 L30 78 Z" fill="#a78bfa" opacity="0.8" />
    <path d="M96 70 Q102 72, 100 82 L90 78 Z" fill="#a78bfa" opacity="0.8" />
    
    {/* Estrellas decorativas */}
    <motion.g
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      style={{ originX: "60px", originY: "60px" }}
    >
      <path d="M15 40 L17 42 L15 44 L13 42 Z" fill="#fbbf24" />
      <path d="M105 35 L107 37 L105 39 L103 37 Z" fill="#fbbf24" />
      <path d="M20 85 L21.5 86.5 L20 88 L18.5 86.5 Z" fill="white" />
      <path d="M100 90 L101.5 91.5 L100 93 L98.5 91.5 Z" fill="white" />
    </motion.g>
    
    {/* Patas */}
    <ellipse cx="52" cy="110" rx="5" ry="6" fill="#f59e0b" />
    <ellipse cx="68" cy="110" rx="5" ry="6" fill="#f59e0b" />
    
    <defs>
      <linearGradient id="spaceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#a78bfa" />
        <stop offset="100%" stopColor="#7c3aed" />
      </linearGradient>
    </defs>
  </motion.svg>
);

// Búho Volando - Para Hero Background
export const OwlFlying = ({ className = "w-24 h-24" }: { className?: string }) => (
  <motion.svg
    className={className}
    viewBox="0 0 140 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    animate={{
      y: [0, -15, 0],
      x: [0, 10, 0],
    }}
    transition={{
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }}
  >
    {/* Alas extendidas */}
    <motion.g
      animate={{ rotate: [-8, 8, -8] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ originX: "30px", originY: "50px" }}
    >
      <path d="M5 45 Q2 35, 8 30 Q15 35, 20 45 Q18 55, 10 58 Z" fill="url(#flyGradient)" opacity="0.9" />
      <path d="M8 40 Q5 35, 10 32" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M10 45 Q7 40, 12 37" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M12 50 Q9 45, 14 42" stroke="#059669" strokeWidth="1.5" fill="none" />
    </motion.g>
    
    {/* Cuerpo central */}
    <ellipse cx="70" cy="50" rx="25" ry="28" fill="#10b981" />
    <ellipse cx="70" cy="55" rx="18" ry="20" fill="#d1fae5" />
    
    {/* Cabeza */}
    <circle cx="70" cy="38" r="18" fill="#10b981" />
    
    {/* Ojos */}
    <circle cx="64" cy="38" r="6" fill="white" />
    <circle cx="64" cy="38" r="4" fill="black" />
    <circle cx="76" cy="38" r="6" fill="white" />
    <circle cx="76" cy="38" r="4" fill="black" />
    
    {/* Pico pequeño */}
    <path d="M70 42 L68 46 L72 46 Z" fill="#fbbf24" />
    
    {/* Ala derecha */}
    <motion.g
      animate={{ rotate: [8, -8, 8] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ originX: "110px", originY: "50px" }}
    >
      <path d="M135 45 Q138 35, 132 30 Q125 35, 120 45 Q122 55, 130 58 Z" fill="url(#flyGradient)" opacity="0.9" />
      <path d="M132 40 Q135 35, 130 32" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M130 45 Q133 40, 128 37" stroke="#059669" strokeWidth="1.5" fill="none" />
      <path d="M128 50 Q131 45, 126 42" stroke="#059669" strokeWidth="1.5" fill="none" />
    </motion.g>
    
    {/* Cola en abanico */}
    <path d="M65 75 Q70 85, 75 75 Q70 78, 65 75" fill="#059669" opacity="0.8" />
    
    {/* Patas recogidas */}
    <ellipse cx="65" cy="72" rx="3" ry="4" fill="#f59e0b" />
    <ellipse cx="75" cy="72" rx="3" ry="4" fill="#f59e0b" />
    
    <defs>
      <linearGradient id="flyGradient" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#10b981" />
        <stop offset="50%" stopColor="#059669" />
        <stop offset="100%" stopColor="#10b981" />
      </linearGradient>
    </defs>
  </motion.svg>
);

// Búho Mini - Para Stats
export const OwlMini = ({ 
  variant = "sitting",
  className = "w-8 h-8" 
}: { 
  variant?: "sitting" | "reading" | "celebrating" | "flying";
  className?: string;
}) => {
  const variants = {
    sitting: (
      <g>
        <ellipse cx="12" cy="14" rx="8" ry="9" fill="white" opacity="0.9" />
        <circle cx="10" cy="12" r="2" fill="white" />
        <circle cx="10" cy="12" r="1.5" fill="black" />
        <circle cx="14" cy="12" r="2" fill="white" />
        <circle cx="14" cy="12" r="1.5" fill="black" />
        <path d="M12 14 L11 15.5 L13 15.5 Z" fill="#fbbf24" />
      </g>
    ),
    reading: (
      <g>
        <ellipse cx="12" cy="14" rx="8" ry="9" fill="white" opacity="0.9" />
        <rect x="8" y="17" width="8" height="5" rx="0.5" fill="white" opacity="0.8" />
        <line x1="10" y1="19" x2="14" y2="19" stroke="black" strokeWidth="0.3" />
        <line x1="10" y1="20" x2="14" y2="20" stroke="black" strokeWidth="0.3" />
        <circle cx="10" cy="12" r="2" fill="white" />
        <circle cx="14" cy="12" r="2" fill="white" />
      </g>
    ),
    celebrating: (
      <g>
        <ellipse cx="12" cy="14" rx="8" ry="9" fill="white" opacity="0.9" />
        <path d="M6 10 L4 8" stroke="#fbbf24" strokeWidth="1" />
        <path d="M18 10 L20 8" stroke="#fbbf24" strokeWidth="1" />
        <circle cx="10" cy="12" r="2" fill="white" />
        <circle cx="14" cy="12" r="2" fill="white" />
        <path d="M9 16 Q12 18, 15 16" stroke="white" strokeWidth="1" fill="none" />
      </g>
    ),
    flying: (
      <g>
        <ellipse cx="12" cy="12" rx="7" ry="8" fill="white" opacity="0.9" />
        <path d="M4 12 Q2 10, 5 9" fill="white" opacity="0.7" />
        <path d="M20 12 Q22 10, 19 9" fill="white" opacity="0.7" />
        <circle cx="10" cy="11" r="1.5" fill="white" />
        <circle cx="14" cy="11" r="1.5" fill="white" />
      </g>
    )
  };

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      {variants[variant]}
    </svg>
  );
};
