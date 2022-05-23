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
