import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ModalSuggestionWord } from './components/modal';
import { useFirebase } from '../../services/useFirebase';
import type { IExpensesValues, IExpensesValuesDBResponse } from '../../utils/interfaces';
import { expensesSchema } from '../../utils/validations';
import { Header } from '../../components/ui/Header';
import { StatsCards } from '../../components/ui/StatsCards';
import { ExpenseForm } from '../../components/ui/ExpenseForm';
import { ExpenseTable } from '../../components/ui/ExpenseTable';
import { Settings } from 'lucide-react';

const initialValues = {
  name: '',
  category: '',
  value: '',
  paymentMethod: '',
  cardUsed: '',
  isShared: false,
};

const Home = () => {
  const { suggestedNames } = useStore();
  const { getDataFirebase, removeDataFirebase, createDataFirebase } = useFirebase();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IExpensesValues>({
    defaultValues: { ...initialValues },
    mode: 'all',
    resolver: zodResolver(expensesSchema),
  });

  const [expenseList, setExpenseList] = useState<IExpensesValuesDBResponse[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [totalShared, setTotalShared] = useState(0);
  const [open, setOpen] = useState(false);

  const handleGetExpense = async () => {
    const data = await getDataFirebase();
    console.log('data ==> ', data);
    setExpenseList(data as IExpensesValuesDBResponse[]);
  };

  const handleDeleteExpense = async (id: string) => {
    await removeDataFirebase(id);
    await handleGetExpense();
  };

  const onSubmit = async (data: IExpensesValues) => {
    const parsedValue = {
      ...data,
      value: parseDecimal(data.value),
      sharedValue: calculateSharedValue(data),
    };

    await createDataFirebase(parsedValue);
    await handleGetExpense();
    reset(initialValues);
  };

  const parseDecimal = (value: string): number => {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotals = useCallback(() => {
    const total = expenseList.reduce((acc, expense) => acc + expense.value, 0);
    const shared = expenseList.reduce((acc, expense) => acc + expense.sharedValue, 0);
    setTotalExpenses(total);
    setTotalShared(shared);
  }, [expenseList]);

  const calculateSharedValue = (expense: IExpensesValues): number => {
    if (expense.isShared) {
      return parseDecimal(expense.value) / 2;
    } else {
      return parseDecimal(expense.value);
    }
  };

  useEffect(() => {
    calculateTotals();
  }, [calculateTotals]);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Header />
      
      <ModalSuggestionWord open={open} setOpen={setOpen} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
              Dashboard de Gastos
            </h1>
            <p className="mt-1 text-[var(--foreground-muted)]">
              Acompanhe e gerencie suas despesas mensais
            </p>
          </div>
          <button 
            onClick={() => setOpen(true)}
            className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--background-card)] px-4 py-2.5 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-[var(--background-elevated)]"
          >
            <Settings className="h-4 w-4" />
            Configurações
          </button>
        </div>

        {/* Stats Cards */}
        <div className="mb-8">
          <StatsCards 
            totalExpenses={totalExpenses}
            totalShared={totalShared}
            transactionCount={expenseList.length}
          />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 gap-8 xl:grid-cols-12">
          {/* Form */}
          <div className="xl:col-span-5">
            <ExpenseForm 
              control={control}
              errors={errors}
              suggestedNames={suggestedNames}
              onSubmit={handleSubmit(onSubmit)}
              onConsultar={handleGetExpense}
            />
          </div>

          {/* Table */}
          <div className="xl:col-span-7">
            <ExpenseTable 
              expenses={expenseList}
              onDelete={handleDeleteExpense}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] bg-[var(--background-secondary)]">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-[var(--foreground-subtle)]">
            © 2024 OrganizaGrana. Gerencie suas finanças com inteligência.
          </p>
        </div>
      </footer>
    </div>
  );
};

export { Home };
