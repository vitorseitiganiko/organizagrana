import { Trash2, MoreHorizontal, Receipt, CreditCard, Wallet } from 'lucide-react';
import type { IExpensesValuesDBResponse } from '../../utils/interfaces';

interface ExpenseTableProps {
  expenses: IExpensesValuesDBResponse[];
  onDelete: (id: string) => void;
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  'Custo Fixo': { bg: 'bg-[var(--accent)]/10', text: 'text-[var(--accent)]' },
  'Casamento': { bg: 'bg-pink-500/10', text: 'text-pink-400' },
  'Entretenimento': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
  'Restaurante': { bg: 'bg-orange-500/10', text: 'text-orange-400' },
  'Mercado': { bg: 'bg-[var(--primary)]/10', text: 'text-[var(--primary)]' },
  'Gasolina': { bg: 'bg-yellow-500/10', text: 'text-yellow-400' },
  'Entreterimento': { bg: 'bg-purple-500/10', text: 'text-purple-400' },
};

const paymentIcons: Record<string, typeof CreditCard> = {
  'Pix': Wallet,
  'Cartão de Crédito': CreditCard,
  'Cartão de Débito': CreditCard,
  'Dinheiro': Wallet,
};

export function ExpenseTable({ expenses, onDelete }: ExpenseTableProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-12">
        <div className="flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--background-elevated)]">
            <Receipt className="h-8 w-8 text-[var(--foreground-subtle)]" />
          </div>
          <h3 className="text-lg font-semibold text-[var(--foreground)]">Nenhuma despesa</h3>
          <p className="mt-1 text-sm text-[var(--foreground-muted)]">
            Clique em &quot;Atualizar&quot; para carregar suas despesas ou adicione uma nova.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] overflow-hidden">
      <div className="border-b border-[var(--border)] p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--accent)]/10">
              <Receipt className="h-5 w-5 text-[var(--accent)]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[var(--foreground)]">Despesas Recentes</h2>
              <p className="text-sm text-[var(--foreground-muted)]">{expenses.length} transações</p>
            </div>
          </div>
          <button className="rounded-lg p-2 text-[var(--foreground-muted)] transition-colors hover:bg-[var(--background-elevated)]">
            <MoreHorizontal className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[var(--border)] bg-[var(--background-secondary)]">
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Nome
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Categoria
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Pagamento
              </th>
              <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Cartão
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Valor
              </th>
              <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Compartilhado
              </th>
              <th className="px-6 py-4 text-center text-xs font-medium uppercase tracking-wider text-[var(--foreground-muted)]">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border)]">
            {expenses.map((expense) => {
              const PaymentIcon = paymentIcons[expense.paymentMethod] || Wallet;
              const categoryStyle = categoryColors[expense.category] || { bg: 'bg-gray-500/10', text: 'text-gray-400' };
              
              return (
                <tr 
                  key={expense.id} 
                  className="transition-colors hover:bg-[var(--background-elevated)]"
                >
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="font-medium text-[var(--foreground)]">{expense.name}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className={`inline-flex rounded-lg px-3 py-1 text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                      {expense.category}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center gap-2 text-[var(--foreground-muted)]">
                      <PaymentIcon className="h-4 w-4" />
                      <span className="text-sm">{expense.paymentMethod}</span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <span className="text-sm text-[var(--foreground-muted)]">{expense.cardUsed}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <span className="font-semibold text-[var(--foreground)]">{formatCurrency(expense.value)}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right">
                    <span className="text-[var(--primary)]">{formatCurrency(expense.sharedValue)}</span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-center">
                    <button
                      onClick={() => onDelete(expense.id)}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="divide-y divide-[var(--border)] lg:hidden">
        {expenses.map((expense) => {
          const PaymentIcon = paymentIcons[expense.paymentMethod] || Wallet;
          const categoryStyle = categoryColors[expense.category] || { bg: 'bg-gray-500/10', text: 'text-gray-400' };
          
          return (
            <div key={expense.id} className="p-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-medium text-[var(--foreground)]">{expense.name}</p>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex rounded-lg px-2 py-0.5 text-xs font-medium ${categoryStyle.bg} ${categoryStyle.text}`}>
                      {expense.category}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[var(--foreground)]">{formatCurrency(expense.value)}</p>
                  <p className="text-sm text-[var(--primary)]">{formatCurrency(expense.sharedValue)}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm text-[var(--foreground-muted)]">
                <div className="flex items-center gap-2">
                  <PaymentIcon className="h-4 w-4" />
                  <span>{expense.paymentMethod}</span>
                  <span className="text-[var(--border)]">•</span>
                  <span>{expense.cardUsed}</span>
                </div>
                <button
                  onClick={() => onDelete(expense.id)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-[var(--foreground-subtle)] transition-colors hover:bg-[var(--destructive)]/10 hover:text-[var(--destructive)]"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
