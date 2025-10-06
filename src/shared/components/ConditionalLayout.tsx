'use client';

import { usePathname } from 'next/navigation';
import { TopNav } from './TopNav';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div className="relative min-h-screen">
      <TopNav />
      <main className="relative">
        {children}
      </main>
    </div>
  );
}
