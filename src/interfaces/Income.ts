export interface Income {
  id: string;
  category: string;
  description?: string;
  name: string;
  value: number;
  receiptDate: string;
  receiptDefault: string;
  startDate: string;
  endDate?: string;
}

export interface IIncomes {
  id: string;
  name: string;
  category: string;
  value: number;
  receiptDate: string;
  iteration: string;
  receiptDefault: string;
  startDate: string;
  endDate?: string;
}

export interface IncomeList {
  id: string;
  category?: string;
  incomeId?: string;
  description?: string;
  name?: string;
  receiptDate?: string;
  accountId?: string;
  receiptDefault?: string;
  startDate?: string;
  endDate?: string;
  value: number;
  paymentDate?: string;
  recurence?: string;
  month?: string;
  income: Income;
}

export interface ICreateIncome {
  name: string;
  userId: string;
  value: number;
  category: string;
  iteration: string;
  receiptDate: Date;
  startDate: Date;
  endDate?: Date | null;
  receiptDefault: string;
}

export interface IUpdateIncome {
  userId: string;
  name?: string;
  value?: number;
  category?: string;
  iteration?: string;
  receiptDate?: Date;
  startDate?: Date;
  endDate?: Date | null;
  receiptDefault?: string;
}

export interface ExpanseList {
  id: string;
  category?: string;
  expanseId?: string;
  description?: string;
  name?: string;
  receiptDate?: string;
  receiptDefault?: string;
  accountId?: string;
  startDate?: string;
  endDate?: string;
  value: number;
  paymentDate?: string;
  recurence?: string;
  month?: string;
  income: Income;
}
