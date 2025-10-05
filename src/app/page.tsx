'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MessageSquare, Network, FileText, BarChart3, Search, Sparkles, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const features = [
  {
    icon: MessageSquare,
    title: 'NASA AI Chat',
    description: 'Conversa con IA entrenada en investigación espacial de NASA',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Network,
    title: '3D Network',
    description: 'Explora redes de colaboración científica en 3D interactivo',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: FileText,
    title: 'Paper Explorer',
    description: 'Navega miles de papers científicos con filtros avanzados',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: BarChart3,
    title: 'Analytics',
    description: 'Visualiza tendencias e insights de investigación',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const [windowDimensions, setWindowDimensions] = useState({ width: 1920, height: 1080 });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
        if (typeof window !== 'undefined') {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      const handleResize = () => {
        setWindowDimensions({
          width: window.innerWidth,
          height: window.innerHeight,
        });
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[var(--navy)] via-[var(--blue-medium)] to-[var(--blue-light)]">
            {isMounted && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * windowDimensions.width,
                y: Math.random() * windowDimensions.height,
              }}
              animate={{
                x: Math.random() * windowDimensions.width,
                y: Math.random() * windowDimensions.height,
              }}
              transition={{
                duration: Math.random() * 20 + 10,
                repeat: Infinity,
                repeatType: 'reverse',
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-12">
                <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16 max-w-4xl"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6 border border-white/20"
          >
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span className="text-sm text-white font-medium">Powered by NASA AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Explore Space
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-300 bg-clip-text text-transparent">
              Research Intelligence
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"
          >
            Descubre, analiza y conecta investigaciones científicas de NASA con IA avanzada.
            Explora papers, redes de colaboración y tendencias en un solo lugar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/chat')}
              className="group px-8 py-4 bg-white text-[var(--navy)] font-semibold rounded-xl hover:bg-blue-50 transition-all flex items-center gap-2 justify-center shadow-lg hover:shadow-xl hover:scale-105"
            >
              <MessageSquare className="w-5 h-5" />
              Comenzar Chat
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => router.push('/graphs')}
              className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl hover:bg-white/20 transition-all flex items-center gap-2 justify-center border border-white/20"
            >
              <Network className="w-5 h-5" />
              Ver Red 3D
            </button>
          </motion.div>
        </motion.div>

                <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl w-full"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + index * 0.1 }}
                onHoverStart={() => setHoveredFeature(index)}
                onHoverEnd={() => setHoveredFeature(null)}
                whileHover={{ y: -8, scale: 1.02 }}
                className="relative group"
              >
                <div className="h-full bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all">
                  <motion.div
                    animate={{
                      scale: hoveredFeature === index ? 1.1 : 1,
                      rotate: hoveredFeature === index ? 5 : 0,
                    }}
                    transition={{ type: 'spring', stiffness: 300 }}
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </motion.div>

                  <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm leading-relaxed">{feature.description}</p>

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: hoveredFeature === index ? '100%' : '0%' }}
                    className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-4`}
                  />
                </div>
              </motion.div>
            );
          })}
        </motion.div>

                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="mt-20 grid grid-cols-3 gap-8 max-w-3xl w-full"
        >
          {[
            { value: '10K+', label: 'Papers' },
            { value: '500+', label: 'Authors' },
            { value: '50+', label: 'Communities' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.6 + index * 0.1, type: 'spring' }}
              className="text-center"
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                className="text-4xl md:text-5xl font-bold text-white mb-2"
              >
                {stat.value}
              </motion.div>
              <div className="text-blue-200 text-sm uppercase tracking-wide">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>

                <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
          className="mt-20 text-center"
        >
          <p className="text-blue-100 mb-4">¿Listo para explorar?</p>
          <button
            onClick={() => router.push('/papers')}
            className="group px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-xl hover:shadow-2xl transition-all flex items-center gap-2 mx-auto"
          >
            <Search className="w-5 h-5" />
            Explorar Papers
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </motion.div>
      </div>
    </div>
  );
}
