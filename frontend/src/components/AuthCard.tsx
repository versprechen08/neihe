import type { ReactNode } from 'react';

interface AuthCardProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-pine px-4">
      <div className="w-full max-w-sm rounded-2xl border-t-4 border-t-gold bg-white p-8 shadow-xl">
        <h1 className="text-center font-serif text-2xl text-ink">{title}</h1>
        <p className="mt-1 text-center text-sm text-ash">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
