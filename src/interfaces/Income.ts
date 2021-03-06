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
