'use client';

import { usePathname } from 'next/navigation';

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <>{children}</>;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg)' }}>
      <main style={{ flex: 1, position: 'relative' }}>
        {children}
      </main>
    </div>
  );
}
