'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Network,
  ArrowRight,
  Rocket,
  Brain,
  TrendingUp,
  Globe
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useAudio } from '@/shared/hooks/useAudio';
import { MemoraLabLogo } from '@/shared/components/MemoraLabLogo';

const features = [
  {
    icon: Brain,
    title: 'AI-Powered Research',
    description: 'Chat with AI specialized in NASA space science literature',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Network,
    title: 'Network Visualization',
    description: 'Explore scientific collaboration networks in interactive 3D',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: TrendingUp,
    title: 'Analytics & Insights',
    description: 'Discover trends and patterns in space research',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Globe,
    title: 'Global Database',
    description: 'Access thousands of scientific papers with advanced search',
    color: 'from-green-500 to-emerald-500',
  },
];

export default function HomePage() {
  const router = useRouter();
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll();
  const { play } = useAudio();

  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.8]);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Autoplay might be blocked, handle gracefully
      });
    }
    // Play welcome audio on page load
    play(['Welcome 1.mp3', "I'm.mp3"]);
  }, [play]);

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#0a0e27]">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="/videos/chica_astronauta.mp4" type="video/mp4" />
          </video>
          {/* Dark Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0a0e27]" />
        </div>

        {/* Logo in top left corner */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="absolute top-8 left-8 z-30"
        >
          <MemoraLabLogo size={80} />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          style={{ opacity, scale }}
          className="relative z-20 flex flex-col items-center justify-center h-full px-4 text-center"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-6xl md:text-8xl font-bold text-white mb-6 leading-tight font-[family-name:var(--font-orbitron)]"
          >
            Explore the
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Future of Space
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto font-[family-name:var(--font-space-grotesk)]"
          >
            Discover, analyze and connect space scientific research with advanced AI technology
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex justify-center"
          >
            <button
              onClick={() => router.push('/chat')}
              className="group px-10 py-5 bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center gap-3 justify-center text-lg hover:scale-105"
            >
              <MessageSquare className="w-6 h-6" />
              Start Exploring
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </motion.div>

        {/* Wave Shape */}
        <div className="absolute bottom-0 left-0 w-full z-10">
          <svg viewBox="0 0 1440 120" className="w-full h-auto">
            <path
              fill="#0a0e27"
              d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4 bg-[#0a0e27]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]">
              Features You Can&apos;t Avoid
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto font-[family-name:var(--font-space-grotesk)]">
              Advanced tools for researchers and space enthusiasts
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  onHoverStart={() => setHoveredFeature(index)}
                  onHoverEnd={() => setHoveredFeature(null)}
                  whileHover={{ y: -12, scale: 1.03 }}
                  className="relative group cursor-pointer"
                >
                  <div className="h-full bg-gradient-to-b from-white/5 to-white/[0.02] backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all">
                    <motion.div
                      animate={{
                        scale: hoveredFeature === index ? 1.1 : 1,
                        rotate: hoveredFeature === index ? 5 : 0,
                      }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 shadow-lg shadow-${feature.color}/50`}
                    >
                      <Icon className="w-8 h-8 text-white" />
                    </motion.div>

                    <h3 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                      {feature.title}
                    </h3>
                    <p className="text-blue-200 leading-relaxed">{feature.description}</p>

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: hoveredFeature === index ? '100%' : '0%' }}
                      className={`h-1 bg-gradient-to-r ${feature.color} rounded-full mt-6`}
                    />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>



      {/* How It Works Section */}
      <section className="relative py-24 px-4 bg-gradient-to-b from-[#0a0e27] to-[#0f1435]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]">
              How It Works
            </h2>
            <p className="text-xl text-blue-200 max-w-2xl mx-auto font-[family-name:var(--font-space-grotesk)]">
              Your research journey in four simple steps
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Search & Discover',
                description: 'Browse through NASA\'s research database with advanced filters and AI-powered search',
                icon: '🔍',
                color: 'from-blue-500 to-cyan-500'
              },
              {
                step: '02',
                title: 'AI Analysis',
                description: 'Our AI analyzes papers, extracts insights, and connects related research automatically',
                icon: '🤖',
                color: 'from-purple-500 to-pink-500'
              },
              {
                step: '03',
                title: 'Visualize Networks',
                description: 'Explore scientific collaboration networks in interactive 3D and discover patterns',
                icon: '🌐',
                color: 'from-orange-500 to-red-500'
              },
              {
                step: '04',
                title: 'Export & Cite',
                description: 'Export your findings, generate citations, and organize your research collections',
                icon: '📚',
                color: 'from-green-500 to-emerald-500'
              }
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="relative"
              >
                <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 border border-white/10 hover:border-white/30 transition-all h-full">
                  <div className={`absolute -top-4 -left-4 w-16 h-16 rounded-2xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white font-bold text-xl shadow-lg`}>
                    {item.step}
                  </div>
                  
                  <div className="text-6xl mb-6 mt-4">{item.icon}</div>
                  
                  <h3 className="text-2xl font-bold text-white mb-3 font-[family-name:var(--font-space-grotesk)]">
                    {item.title}
                  </h3>
                  
                  <p className="text-blue-200 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-32 px-4 bg-gradient-to-b from-[#0f1435] to-[#0a0e27] overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          {[...Array(50)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920),
                y: Math.random() * 800,
              }}
              animate={{
                y: [null, -20, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-6xl font-bold text-white mb-6 font-[family-name:var(--font-orbitron)]"
          >
            Ready to Explore?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-xl text-blue-200 mb-12 font-[family-name:var(--font-space-grotesk)]"
          >
            Join thousands of researchers discovering the future of space
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={() => router.push('/chat')}
              className="group px-10 py-5 bg-gradient-to-r from-cyan-600 to-blue-600 text-white font-bold rounded-full hover:shadow-2xl hover:shadow-cyan-500/50 transition-all flex items-center gap-3 justify-center text-lg hover:scale-105"
            >
              <Rocket className="w-6 h-6 group-hover:-rotate-45 transition-transform" />
              Launch Now
              <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-[#050812] py-16 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-4 font-[family-name:var(--font-orbitron)]">
                Memora Lab
              </h3>
              <p className="text-blue-200 leading-relaxed">
                Exploring the future of space research with artificial intelligence
              </p>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
                Features
              </h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => router.push('/chat')} className="text-blue-200 hover:text-cyan-400 transition-colors">
                    AI Chat
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/graphs')} className="text-blue-200 hover:text-cyan-400 transition-colors">
                    Network
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/explore')} className="text-blue-200 hover:text-cyan-400 transition-colors">
                    Papers
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/analytics')} className="text-blue-200 hover:text-cyan-400 transition-colors">
                    Analytics
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
                Contact
              </h4>
              <ul className="space-y-2 text-blue-200 text-sm">
                <li className="flex items-center gap-2">
                  <span>📍</span>
                  <span>Lima, Peru</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <span>+51 987 654 321</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📺</span>
                  <a 
                    href="https://www.youtube.com/@memoralab" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-cyan-400 transition-colors"
                  >
                    YouTube Channel
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4 font-[family-name:var(--font-space-grotesk)]">
                About
              </h4>
              <p className="text-blue-200 text-sm leading-relaxed mb-3">
                A research platform for exploring NASA&apos;s space science literature using AI technology
              </p>
              <p className="text-blue-200/80 text-xs">
                Developed in Lima, Peru 🇵🇪
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-blue-300 text-sm">
              © 2025 Memora Lab. All rights reserved.
            </p>
            <div className="flex items-center gap-3">
              <span className="text-blue-300 text-sm">Follow us:</span>
              <a 
                href="https://www.youtube.com/@memoralab" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-300 hover:text-red-400 transition-colors"
                aria-label="YouTube Channel"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
