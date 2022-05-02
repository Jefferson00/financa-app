import { Income } from './Income';

export enum AccountTypes {
  'Conta Corrente',
  'Conta Poupança',
  'Outro',
}

export interface IncomesOnAccount {
  paymentDate: string;
  receiptDate: string;
  recurrence?: string;
  value: number;
  income: Income;
}

export interface Account {
  id?: string;
  name: string;
  status: string;
  type: AccountTypes;
  initialValue: number;
  IncomesOnAccounts: IncomesOnAccount[];
}
