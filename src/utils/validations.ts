import { z } from 'zod';

export const expensesSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.string().min(1, 'Categoria é obrigatória'),
  value: z.string().min(1, 'Valor é obrigatório'),
  paymentMethod: z.string().min(1, 'Método de pagamento é obrigatório'),
  cardUsed: z.string().min(1, 'Cartão utilizado é obrigatório'),
  isShared: z.boolean(),
});
