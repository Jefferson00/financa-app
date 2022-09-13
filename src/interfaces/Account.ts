import { Invoice } from './CreditCards';
import { IExpanses } from './Expanse';
import { IIncomes } from './Income';

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
  income: IIncomes;
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
  expanse: IExpanses;
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
  Invoice: Invoice[];
}

export interface ICreateAccount {
  name: string;
  type: string | number;
  status: string;
  initialValue: number;
  userId: string;
}

export interface IUpdateAccount {
  userId: string;
  type?: string | number;
  status?: string;
  name?: string;
}
