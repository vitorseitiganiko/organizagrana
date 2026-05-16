import { Controller, Control, FieldErrors } from 'react-hook-form';
import { 
  Plus, 
  DollarSign, 
  Tag, 
  CreditCard, 
  Wallet,
  Users,
  User
} from 'lucide-react';
import type { IExpensesValues } from '../../utils/interfaces';

interface ExpenseFormProps {
  control: Control<IExpensesValues>;
  errors: FieldErrors<IExpensesValues>;
  suggestedNames: string[];
  onSubmit: () => void;
  onConsultar: () => void;
}

const optionsCategory = ['Custo Fixo', 'Casamento', 'Entretenimento', 'Restaurante', 'Mercado', 'Gasolina'];
const optionsPaymentMethod = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'];
const optionsCardUsed = ['Nubank', 'Flash', 'XP', 'Itau', 'Mercado Pago', 'Pagbank', 'Outro'];

export function ExpenseForm({ control, errors, suggestedNames, onSubmit, onConsultar }: ExpenseFormProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--background-card)] p-6 lg:p-8">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--primary)]/10">
          <Plus className="h-5 w-5 text-[var(--primary)]" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[var(--foreground)]">Nova Despesa</h2>
          <p className="text-sm text-[var(--foreground-muted)]">Adicione uma nova transação</p>
        </div>
      </div>

      <form className="space-y-5">
        {/* Nome */}
        <Controller
          control={control}
          name="name"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <Tag className="h-4 w-4 text-[var(--foreground-muted)]" />
                Nome da Despesa
              </label>
              <input
                {...field}
                type="text"
                placeholder="Ex: Almoço, Combustível..."
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              />
              {errors.name && (
                <p className="text-sm text-[var(--destructive)]">{errors.name.message}</p>
              )}
              {suggestedNames.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {suggestedNames.map((label) => (
                    <button
                      key={label}
                      type="button"
                      onClick={() => field.onChange(label)}
                      className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        />

        {/* Categoria */}
        <Controller
          control={control}
          name="category"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <Tag className="h-4 w-4 text-[var(--foreground-muted)]" />
                Categoria
              </label>
              <select
                {...field}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
              >
                <option value="" className="bg-[var(--background-elevated)]">Selecione uma categoria</option>
                {optionsCategory.map((option) => (
                  <option key={option} value={option} className="bg-[var(--background-elevated)]">
                    {option}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-[var(--destructive)]">{errors.category.message}</p>
              )}
            </div>
          )}
        />

        {/* Valor */}
        <Controller
          control={control}
          name="value"
          render={({ field }) => (
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <DollarSign className="h-4 w-4 text-[var(--foreground-muted)]" />
                Valor
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--foreground-muted)]">R$</span>
                <input
                  {...field}
                  type="text"
                  placeholder="0,00"
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 pl-12 text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                />
              </div>
              {errors.value && (
                <p className="text-sm text-[var(--destructive)]">{errors.value.message}</p>
              )}
              <div className="flex flex-wrap gap-2 pt-1">
                {['30', '50', '100', '200'].map((label) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => field.onChange(label)}
                    className="rounded-lg border border-[var(--border)] bg-[var(--background-secondary)] px-3 py-1.5 text-xs text-[var(--foreground-muted)] transition-all hover:border-[var(--primary)] hover:bg-[var(--primary)]/10 hover:text-[var(--primary)]"
                  >
                    R$ {label}
                  </button>
                ))}
              </div>
            </div>
          )}
        />

        {/* Método de Pagamento e Cartão */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <Wallet className="h-4 w-4 text-[var(--foreground-muted)]" />
                  Método de Pagamento
                </label>
                <select
                  {...field}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  <option value="" className="bg-[var(--background-elevated)]">Selecione</option>
                  {optionsPaymentMethod.map((option) => (
                    <option key={option} value={option} className="bg-[var(--background-elevated)]">
                      {option}
                    </option>
                  ))}
                </select>
                {errors.paymentMethod && (
                  <p className="text-sm text-[var(--destructive)]">{errors.paymentMethod.message}</p>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="cardUsed"
            render={({ field }) => (
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                  <CreditCard className="h-4 w-4 text-[var(--foreground-muted)]" />
                  Cartão Utilizado
                </label>
                <select
                  {...field}
                  className="w-full rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-4 py-3 text-[var(--foreground)] transition-colors focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                >
                  <option value="" className="bg-[var(--background-elevated)]">Selecione</option>
                  {optionsCardUsed.map((option) => (
                    <option key={option} value={option} className="bg-[var(--background-elevated)]">
                      {option}
                    </option>
                  ))}
                </select>
                {errors.cardUsed && (
                  <p className="text-sm text-[var(--destructive)]">{errors.cardUsed.message}</p>
                )}
              </div>
            )}
          />
        </div>

        {/* Compartilhamento */}
        <Controller
          control={control}
          name="isShared"
          render={({ field }) => (
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-sm font-medium text-[var(--foreground)]">
                <Users className="h-4 w-4 text-[var(--foreground-muted)]" />
                Compartilhamento
              </label>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => field.onChange(false)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    !field.value
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]'
                  }`}
                >
                  <User className="h-4 w-4" />
                  Individual
                </button>
                <button
                  type="button"
                  onClick={() => field.onChange(true)}
                  className={`flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium transition-all ${
                    field.value
                      ? 'border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]'
                      : 'border-[var(--border)] bg-[var(--background-elevated)] text-[var(--foreground-muted)] hover:border-[var(--foreground-subtle)]'
                  }`}
                >
                  <Users className="h-4 w-4" />
                  Compartilhada
                </button>
              </div>
            </div>
          )}
        />

        {/* Botões */}
        <div className="flex gap-3 pt-4">
          <button
            type="button"
            onClick={onSubmit}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--primary-hover)]"
          >
            <Plus className="h-4 w-4" />
            Adicionar Despesa
          </button>
          <button
            type="button"
            onClick={onConsultar}
            className="rounded-xl border border-[var(--border)] bg-[var(--background-elevated)] px-6 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-secondary)]"
          >
            Atualizar
          </button>
        </div>
      </form>
    </div>
  );
}
