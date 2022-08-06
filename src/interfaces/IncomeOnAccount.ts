export interface CreateIncomeOnAccount {
  userId: string;
  incomeId: string;
  accountId: string;
  name: string;
  month: Date;
  value: number;
  recurrence: string;
}

export interface IncomeOnAccount {
  id: string;
  name: string;
  value: number;
  accountId: string;
  paymentDate: string;
  incomeId: string;
  recurence?: string;
  month: string;
  income: {
    receiptDate: string;
    id: string;
    name: string;
    category: string;
  };
}

export interface ICreateIncomeOnAccount {
  userId: string;
  incomeId: string;
  accountId: string;
  name: string;
  month: Date;
  value: number;
  recurrence: string;
}
