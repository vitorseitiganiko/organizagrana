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
