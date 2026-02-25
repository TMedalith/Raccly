'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ChatInterface } from '@/features/chat/components/ChatInterface';

function ChatPageInner() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || undefined;
  return <ChatInterface initialQuery={initialQuery} />;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<ChatInterface />}>
      <ChatPageInner />
    </Suspense>
  );
}
