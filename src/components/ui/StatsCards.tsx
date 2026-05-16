import { TrendingDown, TrendingUp, CreditCard, Wallet } from 'lucide-react';

interface StatsCardsProps {
  totalExpenses: number;
  totalShared: number;
  transactionCount: number;
}

export function StatsCards({ totalExpenses, totalShared, transactionCount }: StatsCardsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 transition-all hover:border-[var(--primary)]/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Total Gastos</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              {formatCurrency(totalExpenses)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--destructive)]/10">
            <TrendingDown className="h-6 w-6 text-[var(--destructive)]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[var(--destructive)]/10 px-2 py-0.5 text-[var(--destructive)]">
            -12%
          </span>
          <span className="text-[var(--foreground-subtle)]">vs. mês anterior</span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 transition-all hover:border-[var(--primary)]/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Valor Compartilhado</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              {formatCurrency(totalShared)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--accent)]/10">
            <TrendingUp className="h-6 w-6 text-[var(--accent)]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[var(--success)]">
            +8%
          </span>
          <span className="text-[var(--foreground-subtle)]">vs. mês anterior</span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 transition-all hover:border-[var(--primary)]/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Transações</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              {transactionCount}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--primary)]/10">
            <CreditCard className="h-6 w-6 text-[var(--primary)]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[var(--foreground-subtle)]/10 px-2 py-0.5 text-[var(--foreground-subtle)]">
            +{transactionCount}
          </span>
          <span className="text-[var(--foreground-subtle)]">este mês</span>
        </div>
      </div>

      <div className="group relative overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--background-card)] p-6 transition-all hover:border-[var(--primary)]/50">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-[var(--foreground-muted)]">Economia</p>
            <p className="mt-2 text-2xl font-semibold text-[var(--foreground)]">
              {formatCurrency(totalExpenses - totalShared)}
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--warning)]/10">
            <Wallet className="h-6 w-6 text-[var(--warning)]" />
          </div>
        </div>
        <div className="mt-4 flex items-center gap-2 text-xs">
          <span className="rounded-full bg-[var(--success)]/10 px-2 py-0.5 text-[var(--success)]">
            Dividido
          </span>
          <span className="text-[var(--foreground-subtle)]">com parceiro(a)</span>
        </div>
      </div>
    </div>
  );
}
