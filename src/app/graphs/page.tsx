'use client';

import { CollaborationNetwork3D } from '@/features/graphs/components/CollaborationNetwork3D';
import graphData from '@/shared/services/graph.json';

export default function GraphsPage() {
  return (
    <div className="h-screen w-full pt-24 bg-gradient-to-br from-[#0a0e27] via-[#0f1435] to-[#0a0e27]">
      <CollaborationNetwork3D graphData={graphData} />
    </div>
  );
}
