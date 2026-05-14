import {
  Button,
  Chip,
  Container,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { createDataFirebase, getDataFirebase, removeDataFirebase } from '../../services/useFirebase';
import { ModalSuggestionWord } from './components/modal';
export interface IExpensesValues {
  name: string;
  category: string;
  value: string;
  paymentMethod: string;
  cardUsed: string;
  isShared: boolean;
}

export interface IExpensesValuesDB extends Omit<IExpensesValues, 'value'> {
  value: number;
  sharedValue: number;
}

export interface IExpensesValuesDBResponse extends IExpensesValuesDB {
  id: string;
}

const initialValues = {
  name: '',
  category: '',
  value: '',
  paymentMethod: '',
  cardUsed: '',
  isShared: false,
};

const expensesSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.string().min(1, 'Valor é obrigatório'),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  cardUsed: z.string().min(1, 'Cartão utilizado é obrigatório'),
  isShared: z.boolean(),
});

const optionsCategory = ['Custo Fixo', 'Casamento', 'Entreterimento', 'Restaurante', 'Mercado', 'Gasolina'];
const optionsPaymentMethod = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'];
const optionsCardUsed = ['Nubank', 'Flash', 'XP', 'Itau', 'Mercado Pago', 'Pagbank', 'Outro'];

const Home = () => {
  const { suggestedNames } = useStore();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<IExpensesValues>({
    defaultValues: { ...initialValues },
    mode: 'all',
    resolver: zodResolver(expensesSchema),
  });

  const [expenseList, setExpenseList] = useState<IExpensesValuesDBResponse[]>([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [open, setOpen] = useState(false);

  const handleGetData = async () => {
    const data = await getDataFirebase();
    console.log('data ==> ', data);

    setExpenseList(data as IExpensesValuesDBResponse[]);
  };

  const handleDeleteExpense = async (id: string) => {
    await removeDataFirebase(id);
    await handleGetData();
  };

  const onSubmit = async (data: IExpensesValues) => {
    const parsedValue = {
      ...data,
      value: parseDecimal(data.value),
      sharedValue: calculateSharedValue(data),
    };

    await createDataFirebase(parsedValue);
    await handleGetData();
  };

  const parseDecimal = (value: string): number => {
    const parsed = parseFloat(value.replace(',', '.'));
    return isNaN(parsed) ? 0 : parsed;
  };

  const calculateTotalExpenses = useCallback(() => {
    const total = expenseList.reduce((acc, expense) => acc + expense.value, 0);
    setTotalExpenses(total);
  }, [expenseList]);

  const calculateSharedValue = (expense: IExpensesValues): number => {
    if (expense.isShared) {
      return parseDecimal(expense.value) / 2;
    } else {
      return parseDecimal(expense.value);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    calculateTotalExpenses();
  }, [calculateTotalExpenses]);

  return (
    <div>
      <Button onClick={() => setOpen(true)}>Open modal</Button>

      <ModalSuggestionWord open={open} setOpen={setOpen} />

      {suggestedNames.map((label) => (
        <Chip
          key={label}
          label={label}
          style={{ marginRight: 8 }}
          clickable
          color='primary'
          variant='outlined'
        />
      ))}

      <form onSubmit={handleSubmit(onSubmit)}>
        <Container maxWidth='sm' sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <h1>Organiza Grana</h1>

          <Controller
            control={control}
            name='name'
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label='Nome'
                  variant='outlined'
                  error={!!errors.name}
                  helperText={errors.name?.message}
                />
                <div className='flex gap-4'>
                  {['Aluguel', 'Luz', 'Internet', 'Gasolina'].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      onClick={() => field.onChange(label)}
                      style={{ marginRight: 8 }}
                      clickable
                      color='primary'
                      variant='outlined'
                    />
                  ))}
                </div>
              </>
            )}
          />

          <FormControl fullWidth error={!!errors.category} style={{ marginTop: '16px' }}>
            <InputLabel id='category-label'>Categoria</InputLabel>
            <Controller
              control={control}
              name='category'
              render={({ field }) => (
                <Select {...field} labelId='category-label' label='Categoria'>
                  {optionsCategory.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
          </FormControl>

          <Controller
            control={control}
            name='value'
            render={({ field }) => (
              <>
                <TextField
                  {...field}
                  label='Valor'
                  variant='outlined'
                  error={!!errors.value}
                  helperText={errors.value?.message}
                />

                <div style={{ display: 'flex', gap: 1 }}>
                  {['30', '50', '100', '200'].map((label) => (
                    <Chip
                      key={label}
                      label={label}
                      onClick={() => field.onChange(label)}
                      style={{ marginRight: 8 }}
                      clickable
                      color='primary'
                      variant='outlined'
                    />
                  ))}
                </div>
              </>
            )}
          />

          <FormControl fullWidth error={!!errors.paymentMethod} style={{ marginTop: '16px' }}>
            <InputLabel id='paymentMethod-label'>Método de Pagamento</InputLabel>
            <Controller
              control={control}
              name='paymentMethod'
              render={({ field }) => (
                <Select {...field} labelId='paymentMethod-label' label='Método de Pagamento'>
                  {optionsPaymentMethod.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.paymentMethod && <FormHelperText>{errors.paymentMethod.message}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={!!errors.cardUsed}>
            <InputLabel id='cardUsed-label'>Cartão Utilizado</InputLabel>
            <Controller
              control={control}
              name='cardUsed'
              render={({ field }) => (
                <Select {...field} labelId='cardUsed-label' label='Cartão Utilizado'>
                  {optionsCardUsed.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            {errors.cardUsed && <FormHelperText>{errors.cardUsed.message}</FormHelperText>}
          </FormControl>

          <FormControl>
            <FormLabel id='isShared-label'>Compartilhamento</FormLabel>
            <Controller
              control={control}
              name='isShared'
              render={({ field }) => (
                <RadioGroup {...field} row>
                  <FormControlLabel value={true} control={<Radio />} label='Compartilhada' />
                  <FormControlLabel value={false} control={<Radio />} label='Individual' />
                </RadioGroup>
              )}
            />
          </FormControl>
        </Container>
      </form>
      <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit(onSubmit)}>
        Salvar
      </Button>

      <Button variant='contained' sx={{ mt: 2 }} onClick={handleGetData}>
        Consultar
      </Button>

      <Container sx={{ mt: 4 }}>
        <h2>Despesas Cadastradas</h2>
        <TableContainer component={Paper}>
          <Table aria-label='tabela de despesas'>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'black' }}>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Nome</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Categoria</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Método de Pagamento</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Cartão Utilizado</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor (R$)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Valor Compartilhado (R$)</TableCell>
                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {expenseList.map((expense, idx) => (
                <TableRow
                  key={expense.id}
                  sx={{ backgroundColor: idx % 2 === 0 ? 'background.paper' : '#f5f5f5' }}
                >
                  <TableCell>{expense.name}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>{expense.paymentMethod}</TableCell>
                  <TableCell>{expense.cardUsed}</TableCell>
                  <TableCell>{expense.value}</TableCell>
                  <TableCell>{expense.sharedValue}</TableCell>
                  <TableCell>
                    <Button variant='contained' color='error' onClick={() => handleDeleteExpense(expense.id)}>
                      Excluir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <h2>Total de Despesas: R$ {totalExpenses}</h2>
    </div>
  );
};

export { Home };
