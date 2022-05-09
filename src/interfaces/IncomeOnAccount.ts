export interface CreateIncomeOnAccount {
  userId: string;
  incomeId: string;
  accountId: string;
  month: Date;
  value: number;
  recurrence: string;
}

export interface IncomeOnAccount {
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
