export interface Expanse {
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

export interface IExpanses {
  id: string;
  category: string;
  description?: string;
  name: string;
  value: number;
  receiptDate: string;
  receiptDefault: string;
  startDate: string;
  iteration: string;
  endDate?: string;
}

export interface ExpanseList {
  id: string;
  category?: string;
  description?: string;
  name?: string;
  receiptDate?: string;
  receiptDefault?: string;
  startDate?: string;
  endDate?: string;
  value: number;
  paymentDate?: string;
  recurence?: string;
  expanse: Expanse;
}

export interface ICreateExpanse {
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

export interface IUpdateExpanse {
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
