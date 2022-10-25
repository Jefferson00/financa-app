export interface ExpanseOnInvoice {
  id: string;
  recurrence?: string;
  expanseId: string;
  value: number;
  name: string;
  invoiceId: string;
  day: number;
}

export interface Invoice {
  id: string;
  month: string;
  closingDate: string;
  paymentDate: string;
  paid: boolean;
  closed: boolean;
  value: number;
  creditCardId: string;
  accountId: string;
  updatedAt: string;
  ExpanseOnInvoice: ExpanseOnInvoice[];
}

export interface CreditCards {
  id: string;
  name: string;
  limit: number;
  paymentDate: string;
  invoiceClosing: string;
  color: string;
  receiptDefault: string;
  userId: string;
  Invoice: Invoice[];
}

export interface IExpanseOnInvoice {
  id: string;
  recurrence?: string;
  expanseId: string;
  value: number;
  name: string;
  invoiceId: string;
  day: number;
}
export interface IInvoice {
  id: string;
  month: string;
  closingDate: string;
  paymentDate: string;
  paid: boolean;
  closed: boolean;
  value: number;
  creditCardId: string;
  accountId: string;
  updatedAt: string;
  name?: string;
  ExpanseOnInvoice: IExpanseOnInvoice[];
}

export interface ICreditCard {
  id: string;
  name: string;
  limit: number;
  paymentDate: string;
  invoiceClosing: string;
  color: string;
  receiptDefault: string;
  userId: string;
  Invoice: IInvoice[];
}

export interface ICreateCreditCard {
  name: string;
  userId: string;
  limit: number;
  color: string;
  paymentDate: Date;
  invoiceClosing: Date;
  receiptDefault: string;
}

export interface IUpdateCreditCard {
  name?: string;
  userId: string;
  limit?: number;
  color?: string;
  paymentDate?: Date;
  invoiceClosing?: Date;
  receiptDefault?: string;
}
