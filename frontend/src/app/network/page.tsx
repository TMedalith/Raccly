'use client';

import { CollaborationNetwork3D } from '@/features/graphs/components/CollaborationNetwork3D';
import { getAllPapers } from '@/shared/utils/paperReference';
import { motion } from 'framer-motion';
import graphData from '@/shared/services/graph.json';

export default function NetworkPage() {
  const allPapers = getAllPapers();

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-[radial-gradient(circle_at_center,_white_0%,_#fef9c3_100%)]">
      {/* Sidebar space */}
      <div className="w-20 flex-shrink-0" />
      
      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <div className="flex-shrink-0 border-b-2 border-slate-900 bg-white">
          <div className="px-3 sm:px-4 lg:px-6 py-2">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-baseline gap-2 sm:gap-3"
            >
              <h1 className="text-base sm:text-xl lg:text-2xl xl:text-3xl font-bold text-slate-900 font-[family-name:var(--font-space-grotesk)] tracking-tight">
                Research Network
              </h1>
              <p className="text-slate-500 text-xs font-[family-name:var(--font-inter)]">
                {allPapers.length.toLocaleString()} papers
              </p>
            </motion.div>
          </div>
        </div>

        {/* Content Area - 3D Network */}
        <div className="flex-1 overflow-hidden relative min-h-0">
          <CollaborationNetwork3D graphData={graphData} />
        </div>
      </div>
    </div>
  );
}
