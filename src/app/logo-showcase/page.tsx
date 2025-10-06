'use client';

import { AnimatedLogo, CompactLogo, LoadingLogo } from '@/shared/components/AnimatedLogo';

export default function LogoShowcasePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Memora Lab - Logo Showcase
          </h1>
          <p className="text-gray-600">
            Animated logo with multiple variants for different uses
          </p>
        </div>

        {/* Grid de variantes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Main Logo with Text */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Main Logo with Text
            </h2>
            <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8">
              <AnimatedLogo size={120} showText={true} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              ✨ Use: Main header, landing page, presentations
            </p>
          </div>

          {/* Logo Only */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Logo Only (No Text)
            </h2>
            <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8">
              <AnimatedLogo size={120} showText={false} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              🎯 Use: Favicon, app icons, decorative elements
            </p>
          </div>

          {/* Compact Logo */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Compact Logo (Navbar)
            </h2>
            <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-8">
              <CompactLogo size={50} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              📱 Use: Navigation bar, mobile menu, thumbnails
            </p>
          </div>

          {/* Loading Logo */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Loading Logo
            </h2>
            <div className="flex items-center justify-center min-h-[200px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8">
              <LoadingLogo size={80} />
            </div>
            <p className="text-sm text-gray-600 mt-4">
              ⏳ Use: Loading states, splash screens
            </p>
          </div>
        </div>

        {/* Different sizes */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Scalability - Different Sizes
          </h2>
          <div className="flex items-end justify-center gap-8 min-h-[300px] bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-8">
            <div className="text-center">
              <AnimatedLogo size={40} showText={false} />
              <p className="text-xs text-gray-600 mt-2">40px</p>
            </div>
            <div className="text-center">
              <AnimatedLogo size={60} showText={false} />
              <p className="text-xs text-gray-600 mt-2">60px</p>
            </div>
            <div className="text-center">
              <AnimatedLogo size={80} showText={false} />
              <p className="text-xs text-gray-600 mt-2">80px</p>
            </div>
            <div className="text-center">
              <AnimatedLogo size={120} showText={false} />
              <p className="text-xs text-gray-600 mt-2">120px</p>
            </div>
            <div className="text-center">
              <AnimatedLogo size={160} showText={false} />
              <p className="text-xs text-gray-600 mt-2">160px</p>
            </div>
          </div>
        </div>

        {/* On different backgrounds */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Versatility - Different Backgrounds
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-6 flex items-center justify-center min-h-[150px]">
              <CompactLogo size={60} />
              <p className="absolute bottom-2 text-xs text-gray-600">White</p>
            </div>
            <div className="bg-gray-900 rounded-xl p-6 flex items-center justify-center min-h-[150px]">
              <CompactLogo size={60} />
              <p className="absolute bottom-2 text-xs text-white">Black</p>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 flex items-center justify-center min-h-[150px]">
              <CompactLogo size={60} />
              <p className="absolute bottom-2 text-xs text-white">Gradient</p>
            </div>
            <div className="bg-gradient-to-br from-green-400 to-blue-500 rounded-xl p-6 flex items-center justify-center min-h-[150px]">
              <CompactLogo size={60} />
              <p className="absolute bottom-2 text-xs text-white">Color</p>
            </div>
          </div>
        </div>

        {/* Technical specifications */}
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            📋 Technical Specifications
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Main Colors:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#1e3a8a] border-2 border-gray-300"></div>
                  <div>
                    <p className="font-mono text-sm">#1e3a8a</p>
                    <p className="text-xs text-gray-600">Primary Blue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#3b82f6] border-2 border-gray-300"></div>
                  <div>
                    <p className="font-mono text-sm">#3b82f6</p>
                    <p className="text-xs text-gray-600">Secondary Blue</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-lg bg-[#60a5fa] border-2 border-gray-300"></div>
                  <div>
                    <p className="font-mono text-sm">#60a5fa</p>
                    <p className="text-xs text-gray-600">Light Blue</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-700">Features:</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Smooth animation with Framer Motion</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Responsive and scalable (SVG)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Interactive hover effects</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Multiple use variants</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Performance optimized</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600">✓</span>
                  <span>Compatible with light and dark themes</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Usage code */}
        <div className="bg-gray-900 rounded-2xl p-8 shadow-lg mt-8">
          <h2 className="text-2xl font-semibold text-white mb-6">
            💻 Usage Code
          </h2>
          <div className="bg-gray-800 rounded-xl p-6 overflow-x-auto">
            <pre className="text-sm text-green-400">
{`import { AnimatedLogo, CompactLogo, LoadingLogo } from '@/shared/components/AnimatedLogo';

// Logo completo con texto
<AnimatedLogo size={120} showText={true} />

// Logo sin texto
<AnimatedLogo size={80} showText={false} />

// Logo compacto para navbar
<CompactLogo size={40} />

// Logo de carga
<LoadingLogo size={60} />`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
