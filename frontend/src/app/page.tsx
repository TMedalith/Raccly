'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import {
  MessageSquare,
  Sparkles,
  FileText,
  Zap,
  Target,
  Rocket,
  BookOpen,
  DollarSign,
  Star
} from 'lucide-react';
import { OwlLogo, OwlChat, OwlScientist, OwlAstronaut, OwlMini } from '@/shared/components/OwlIcons';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen w-full" style={{
      background: `
        radial-gradient(
  ellipse at center,
   #ffffff 0%,
  #ffffff 35%,
  #f9ffd6 55%,
  #f3fbc4 75%,
  #e8f87e 100%
);
      `
    }}>
      {/* Header - Estilo Chatbot TNC */}
      <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-8 py-5">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <OwlLogo className="w-10 h-10" />
              <span className="text-2xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)] tracking-tight">
                Raccly
              </span>
            </div>

            {/* Navigation Pills */}
            <nav className="hidden md:flex items-center gap-2 bg-white rounded-full px-2 py-2 shadow-lg border border-slate-300">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-[15px] font-semibold rounded-full transition-all font-[family-name:var(--font-inter)] hover:scale-105"
              >
                Features
              </button>
              <button 
                onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-[15px] font-semibold rounded-full transition-all font-[family-name:var(--font-inter)] hover:scale-105"
              >
                How It Works
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-7 py-3 text-slate-700 hover:bg-slate-100 hover:text-slate-900 text-[15px] font-semibold rounded-full transition-all font-[family-name:var(--font-inter)] hover:scale-105"
              >
                About
              </button>
            </nav>

            {/* Get Started Button */}
            <button 
              onClick={() => router.push('/chat')}
              className="px-8 py-3 bg-[#d4f78a] hover:bg-[#c9f76f] text-slate-900 text-sm font-semibold rounded-full hover:shadow-xl hover:scale-105 transition-all font-[family-name:var(--font-inter)] border-2 border-slate-900"
            >
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section - Estilo Chatbot TNC */}
      <section className="relative pt-32 pb-20 px-8 overflow-visible">
        <div className="max-w-6xl mx-auto relative">
          {/* Texto Hero */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight font-[family-name:var(--font-space-grotesk)] max-w-4xl mx-auto tracking-tight">
              Research NASA Papers
              <br />
              </h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-lg text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed font-[family-name:var(--font-inter)]"
            >
              Ask questions. Get instant answers with citations. Built for scientists planning Moon and Mars missions.
            </motion.p>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <button
                onClick={() => router.push('/explore')}
                className="px-10 py-4 bg-[#d4f78a] hover:bg-[#c9f76f] text-slate-900 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all font-[family-name:var(--font-inter)] text-base border-2 border-slate-900"
              >
                See Demo
              </button>
            </motion.div>
          </motion.div>

          {/* Líneas punteadas con búhos decorativos - Estilo Chatbot TNC */}
          <div className="relative">
            {/* Mockup centrado de la app */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="relative z-10 mx-auto max-w-5xl"
            >
              <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-200">
                {/* Mockup de la interfaz de chat */}
                <div className="aspect-[16/10] bg-gradient-to-br from-slate-50 to-slate-100 p-8">
                  {/* Aquí iría el screenshot real de tu app */}
                  <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Header del chat */}
                    <div className="bg-slate-900 p-4 flex items-center gap-3">
                      <OwlLogo className="w-8 h-8" />
                      <div className="flex-1">
                        <div className="text-white font-semibold font-[family-name:var(--font-space-grotesk)]">Raccly AI Assistant</div>
                        <div className="text-white/80 text-xs font-[family-name:var(--font-inter)]">608 NASA Papers • Ready</div>
                      </div>
                    </div>
                    {/* Área de mensajes */}
                    <div className="p-6 space-y-4">
                      {/* Mensaje del usuario */}
                      <div className="flex justify-end">
                        <div className="bg-slate-100 rounded-2xl rounded-br-sm px-4 py-3 max-w-md border-2 border-slate-200">
                          <p className="text-sm text-slate-800 font-[family-name:var(--font-inter)]">What are the effects of microgravity on plant growth?</p>
                        </div>
                      </div>
                      {/* Respuesta del AI */}
                      <div className="flex gap-3">
                        <div className="flex-shrink-0">
                          <OwlLogo className="w-8 h-8" />
                        </div>
                        <div className="bg-[#d4f78a]/30 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xl border-2 border-[#d4f78a]">
                          <p className="text-sm text-slate-800 mb-2 font-[family-name:var(--font-inter)]">Based on 608 NASA papers, microgravity significantly affects plant growth patterns...</p>
                          <div className="flex gap-2 mt-2">
                            <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-600 border-2 border-slate-900 font-[family-name:var(--font-inter)]">📄 Kiss et al. 2014</span>
                            <span className="text-xs bg-white px-2 py-1 rounded-full text-slate-600 border-2 border-slate-900 font-[family-name:var(--font-inter)]">📄 Zupanska 2017</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="relative py-20 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              How It Works
            </h2>
            <p className="text-lg text-slate-600 font-[family-name:var(--font-inter)]">
              Three simple steps to smarter research
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'Ask in Plain English',
                description: 'No keywords needed. Just type your research question.',
                icon: MessageSquare,
              },
              {
                step: '02',
                title: 'AI Searches 608 Papers',
                description: 'Instant analysis across all NASA bioscience publications.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Get Cited Evidence',
                description: 'Answers backed by precise citations to source papers.',
                icon: FileText,
              },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all border-2 border-slate-200"
                >
                  <div className="text-7xl font-bold text-[#e8f87e] mb-4 font-[family-name:var(--font-space-grotesk)] select-none">
                    {item.step}
                  </div>
                  <div className="absolute top-8 left-8">
                    <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center">
                      <Icon className="w-7 h-7 text-[#d4f78a]" />
                    </div>
                  </div>
                  <div className="mt-8">
                    <h3 className="text-xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-space-grotesk)]">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 leading-relaxed font-[family-name:var(--font-inter)]">
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Product Demo Section */}
      <section className="relative py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              See It In Action
            </h2>
            <p className="text-lg text-slate-600 font-[family-name:var(--font-inter)]">
              Real question. Real AI answer. Real citations.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-slate-200"
          >
            {/* Chat Interface Demo */}
            <div className="p-8">
              {/* User Question */}
              <div className="flex gap-4 mb-6">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold font-[family-name:var(--font-space-grotesk)]">
                  R
                </div>
                <div className="flex-1">
                  <div className="bg-slate-50 rounded-2xl rounded-tl-sm p-4 border-2 border-slate-200">
                    <p className="text-slate-900 font-[family-name:var(--font-inter)]">
                      What are the effects of microgravity on plant growth in space?
                    </p>
                  </div>
                </div>
              </div>

              {/* AI Response */}
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-slate-900 rounded-full flex-shrink-0 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#d4f78a]" />
                </div>
                <div className="flex-1">
                  <div className="bg-[#d4f78a]/20 rounded-2xl rounded-tl-sm p-4 border-2 border-[#d4f78a]">
                    <p className="text-slate-900 font-[family-name:var(--font-inter)] mb-4">
                      Research shows that microgravity significantly affects plant growth patterns. Studies from the ISS demonstrate altered root orientation, modified cell wall structure, and changes in gene expression related to gravity sensing.
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border-2 border-slate-900">
                        📄 Paper #204 - Kiss et al. (2014)
                      </span>
                      <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border-2 border-slate-900">
                        📄 Paper #387 - Zupanska et al. (2017)
                      </span>
                      <span className="px-3 py-1 bg-white text-slate-700 text-xs font-medium rounded-full border-2 border-slate-900">
                        +4 more citations
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-700 font-medium">
                      <Target className="w-3.5 h-3.5" />
                      <span>Knowledge gap identified: Long-term multigenerational studies needed</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Three Tools. One Platform.
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto font-[family-name:var(--font-inter)]">
              Everything you need for space bioscience research.
            </p>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                OwlComponent: OwlChat,
                title: 'AI Chat',
                description: 'Ask questions in plain English. Get instant, cited answers from 608 NASA papers.',
                link: '/chat'
              },
              {
                OwlComponent: OwlScientist,
                title: 'Explore Papers',
                description: 'Browse and filter 608 NASA bioscience publications. Find exactly what you need.',
                link: '/explore'
              },
              {
                OwlComponent: OwlAstronaut,
                title: 'Research Network',
                description: 'Visualize connections, identify gaps, and discover consensus across decades of research.',
                link: '/network'
              },
            ].map((feature, index) => {
              const OwlIcon = feature.OwlComponent;
              return (
                <motion.button
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  onClick={() => router.push(feature.link)}
                  className="bg-white rounded-3xl p-8 hover:shadow-2xl transition-all border-2 border-slate-200 group text-left"
                >
                  <div className="flex justify-center mb-6">
                    <OwlIcon className="w-20 h-20 group-hover:scale-110 transition-transform" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3 font-[family-name:var(--font-space-grotesk)] text-center">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed font-[family-name:var(--font-inter)] text-center">{feature.description}</p>
                </motion.button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative py-20 px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              What Researchers Say
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: 'Dr. Sarah Chen',
                role: 'Plant Biologist, NASA Ames',
                quote: 'Cut my lit review from weeks to hours. Citations are spot-on.',
                avatar: 'SC',
              },
              {
                name: 'Dr. Michael Rodriguez',
                role: 'Mission Planner, ESA',
                quote: 'Gap analysis showed us exactly where to focus research funding.',
                avatar: 'MR',
              },
              {
                name: 'Prof. Lisa Thompson',
                role: 'Research Director, MIT',
                quote: 'First tool that actually gets bioscience nuance. Saves me 10+ hours per week.',
                avatar: 'LT',
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
                className="bg-white rounded-3xl p-6 border-2 border-slate-200 shadow-lg hover:shadow-xl transition-all"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-full flex items-center justify-center text-[#d4f78a] font-bold font-[family-name:var(--font-space-grotesk)]">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                      {testimonial.name}
                    </div>
                    <div className="text-xs text-slate-600 font-[family-name:var(--font-inter)]">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
                <p className="text-slate-700 leading-relaxed font-[family-name:var(--font-inter)] italic">
                  &quot;{testimonial.quote}&quot;
                </p>
                <div className="flex gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#d4f78a] text-[#d4f78a]" />
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="relative py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 font-[family-name:var(--font-space-grotesk)] tracking-tight">
              Built for Every Role
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              {
                role: 'Scientists',
                icon: BookOpen,
                needs: 'Generate hypotheses faster',
                benefits: [
                  'Mine objective findings from Results',
                  'Find consensus and disagreements',
                  'Discover unexpected connections',
                ],
              },
              {
                role: 'Managers',
                icon: DollarSign,
                needs: 'Fund the right research',
                benefits: [
                  'Spot knowledge gaps needing funding',
                  'Track research progress',
                  'Prioritize high-impact areas',
                ],
              },
              {
                role: 'Mission Planners',
                icon: Rocket,
                needs: 'Plan safer missions',
                benefits: [
                  'Access validated safety data',
                  'Understand biological space responses',
                  'Make evidence-based decisions',
                ],
              },
            ].map((useCase, index) => {
              const Icon = useCase.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15, duration: 0.5 }}
                  className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all border-2 border-slate-200"
                >
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center mb-5">
                    <Icon className="w-7 h-7 text-[#d4f78a]" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2 font-[family-name:var(--font-space-grotesk)]">{useCase.role}</h3>
                  <p className="text-sm text-slate-500 mb-4 font-[family-name:var(--font-inter)] italic">{useCase.needs}</p>
                  <ul className="space-y-2">
                    {useCase.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 font-[family-name:var(--font-inter)]">
                        <div className="w-5 h-5 bg-[#d4f78a] rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <div className="w-2 h-2 bg-slate-900 rounded-full" />
                        </div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section id="stats" className="relative py-16 px-8 bg-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '608', label: 'NASA Papers', sublabel: 'Analyzed', owlVariant: 'reading' as const },
              { value: '99.9%', label: 'Uptime', sublabel: 'Reliability', owlVariant: 'sitting' as const },
              { value: '50M+', label: 'Data Points', sublabel: 'Extracted', owlVariant: 'flying' as const },
              { value: '4.9 ★', label: 'Rating', sublabel: 'User reviews', owlVariant: 'celebrating' as const },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <div className="flex justify-center mb-2">
                  <OwlMini variant={stat.owlVariant} className="w-10 h-10" />
                </div>
                <div className="text-4xl md:text-5xl font-bold mb-2 font-[family-name:var(--font-space-grotesk)] text-[#d4f78a]">{stat.value}</div>
                <div className="text-sm font-semibold text-white font-[family-name:var(--font-space-grotesk)]">{stat.label}</div>
                <div className="text-xs text-white/60 mt-1 font-[family-name:var(--font-inter)]">{stat.sublabel}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-8 bg-slate-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#d4f78a]/20 backdrop-blur-sm rounded-full mb-6 border-2 border-[#d4f78a]"
          >
            <Zap className="w-4 h-4 text-[#d4f78a]" />
            <span className="text-[#d4f78a] text-sm font-medium font-[family-name:var(--font-inter)]">
              Free for first 100 institutions
            </span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-white mb-6 font-[family-name:var(--font-space-grotesk)] tracking-tight"
          >
            Start Researching Faster Today
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 mb-10 font-[family-name:var(--font-inter)]"
          >
            No credit card. No setup. Just instant access to 608 NASA papers.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button
              onClick={() => router.push('/chat')}
              className="px-10 py-4 bg-[#d4f78a] hover:bg-[#c9f76f] text-slate-900 font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all font-[family-name:var(--font-space-grotesk)] border-2 border-slate-900"
            >
              Try It Free →
            </button>
            <button
              onClick={() => router.push('/explore')}
              className="px-10 py-4 bg-transparent text-white font-semibold rounded-full border-2 border-white/40 hover:bg-white/10 backdrop-blur-sm transition-all font-[family-name:var(--font-space-grotesk)]"
            >
              See Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative bg-white py-12 px-8 border-t-2 border-slate-200 overflow-hidden">
        {/* Búho durmiendo decorativo */}
        <div className="absolute bottom-4 right-8 opacity-30">
          <motion.svg
            width="60"
            height="60"
            viewBox="0 0 80 80"
            fill="none"
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            {/* Rama */}
            <line x1="10" y1="60" x2="70" y2="60" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
            
            {/* Cuerpo durmiendo */}
            <ellipse cx="40" cy="48" rx="18" ry="20" fill="#10b981" />
            
            {/* Ala cubriendo */}
            <path d="M25 45 Q20 48, 25 55 Q30 50, 28 45 Z" fill="#059669" />
            <path d="M55 45 Q60 48, 55 55 Q50 50, 52 45 Z" fill="#059669" />
            
            {/* Cabeza dormida */}
            <ellipse cx="40" cy="40" rx="14" ry="12" fill="#10b981" />
            
            {/* Ojos cerrados */}
            <motion.path
              d="M33 38 Q35 40, 37 38"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            <motion.path
              d="M43 38 Q45 40, 47 38"
              stroke="#334155"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />
            
            {/* Pico pequeño */}
            <path d="M40 42 L39 44 L41 44 Z" fill="#fbbf24" />
            
            {/* Z Z Z dormido */}
            <motion.g
              animate={{ opacity: [0.3, 0.8, 0.3] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <text x="58" y="30" fill="#94a3b8" fontSize="10" fontWeight="bold">Z</text>
              <text x="62" y="22" fill="#94a3b8" fontSize="8" fontWeight="bold">Z</text>
              <text x="65" y="16" fill="#94a3b8" fontSize="6" fontWeight="bold">Z</text>
            </motion.g>
            
            {/* Patas */}
            <ellipse cx="36" cy="62" rx="3" ry="2" fill="#f59e0b" />
            <ellipse cx="44" cy="62" rx="3" ry="2" fill="#f59e0b" />
          </motion.svg>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <OwlLogo className="w-8 h-8" />
                <span className="text-lg font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)]">
                  Raccly
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed font-[family-name:var(--font-inter)]">
                NASA bioscience research
                <br />powered by AI
              </p>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-3 text-sm font-[family-name:var(--font-inter)]">Product</h4>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => router.push('/chat')} className="text-slate-600 hover:text-green-600 transition-colors text-sm font-[family-name:var(--font-inter)]">
                    AI Chat
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/explore')} className="text-slate-600 hover:text-green-600 transition-colors text-sm font-[family-name:var(--font-inter)]">
                    Publications
                  </button>
                </li>
                <li>
                  <button onClick={() => router.push('/network')} className="text-slate-600 hover:text-green-600 transition-colors text-sm font-[family-name:var(--font-inter)]">
                    Research Network
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-3 text-sm font-[family-name:var(--font-inter)]">Resources</h4>
              <ul className="space-y-2 text-slate-600 text-sm font-[family-name:var(--font-inter)]">
                <li className="hover:text-green-600 cursor-pointer transition-colors">NASA OSDR</li>
                <li className="hover:text-green-600 cursor-pointer transition-colors">Space Life Sciences Library</li>
                <li className="hover:text-green-600 cursor-pointer transition-colors">NASA Task Book</li>
              </ul>
            </div>

            <div>
              <h4 className="text-slate-900 font-semibold mb-3 text-sm font-[family-name:var(--font-inter)]">Connect</h4>
              <ul className="space-y-2 text-slate-600 text-sm font-[family-name:var(--font-inter)]">
                <li>Lima, Peru</li>
                <li>
                  <a 
                    href="https://www.youtube.com/@raccly" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-green-600 transition-colors"
                  >
                    YouTube
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-slate-500 text-xs font-[family-name:var(--font-inter)]">
              © 2025 Raccly. Powered by NASA Open Data & AI.
            </p>
            <div className="flex gap-4 text-xs text-slate-500 font-[family-name:var(--font-inter)]">
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Privacy</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Terms</span>
              <span className="hover:text-slate-900 cursor-pointer transition-colors">Accessibility</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
