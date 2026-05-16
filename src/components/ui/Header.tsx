import { Wallet } from 'lucide-react';

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--primary)]">
            <Wallet className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-semibold text-[var(--foreground)]">
            OrganizaGrana
          </span>
        </div>
        
        <nav className="hidden items-center gap-6 md:flex">
          <a href="#" className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]">
            Dashboard
          </a>
          <a href="#" className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]">
            Relatórios
          </a>
          <a href="#" className="text-sm text-[var(--foreground-muted)] transition-colors hover:text-[var(--foreground)]">
            Configurações
          </a>
        </nav>
        
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-medium text-white">
            V
          </div>
        </div>
      </div>
    </header>
  );
}
