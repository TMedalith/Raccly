'use client';

import { CollaborationNetwork3D } from '@/features/graphs/components/CollaborationNetwork3D';
import graphData from '@/shared/services/graph.json';

export default function GraphsPage() {
  return (
    <div className="h-full w-full">
      <CollaborationNetwork3D graphData={graphData} />
    </div>
  );
}
