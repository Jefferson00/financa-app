import { AccountBalance } from './AccountBalance';
import { Expanse } from './Expanse';
import { Income } from './Income';

export enum AccountTypes {
  'Conta Corrente',
  'Conta Poupança',
  'Outro',
}

export interface IIncomesOnAccount {
  id: string;
  month: string;
  paymentDate: string;
  receiptDate: string;
  recurrence?: string;
  value: number;
  incomeId: string;
  accountId: string;
  name: string;
  income: Income;
}

export interface IExpansesOnAccount {
  id: string;
  month: string;
  paymentDate: string;
  receiptDate: string;
  recurrence?: string;
  value: number;
  expanseId: string;
  accountId: string;
  name: string;
  expanse: Expanse;
}

export interface IAccount {
  id: string;
  name: string;
  status: string;
  type: AccountTypes;
  initialValue: number;
  balance: number;
  userId: string;
  incomesOnAccount: IIncomesOnAccount[];
  expansesOnAccount: IExpansesOnAccount[];
}
