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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { ModalSuggestionWord } from './components/modal';
import { useFirebase } from '../../services/useFirebase';
import type { IExpensesValues, IExpensesValuesDBResponse } from '../../utils/interfaces';
import { expensesSchema } from '../../utils/validations';

const initialValues = {
  name: '',
  category: '',
  value: '',
  paymentMethod: '',
  cardUsed: '',
  isShared: false,
};

const optionsCategory = ['Custo Fixo', 'Casamento', 'Entreterimento', 'Restaurante', 'Mercado', 'Gasolina'];
const optionsPaymentMethod = ['Pix', 'Cartão de Crédito', 'Cartão de Débito', 'Dinheiro'];
const optionsCardUsed = ['Nubank', 'Flash', 'XP', 'Itau', 'Mercado Pago', 'Pagbank', 'Outro'];

const Home = () => {
  const { suggestedNames } = useStore();
  const { getDataFirebase, removeDataFirebase, createDataFirebase } = useFirebase();

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
                  {suggestedNames.map((label) => (
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

                {/* <div style={{ display: 'flex', gap: 1 }}>
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
                </div> */}
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

      <Stack direction='row' spacing={2} sx={{ justifyContent: 'center' }}>
        <Button variant='contained' sx={{ mt: 2 }} onClick={handleSubmit(onSubmit)}>
          Salvar
        </Button>

        <Button variant='contained' sx={{ mt: 2 }} onClick={handleGetExpense}>
          Consultar
        </Button>
      </Stack>

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
