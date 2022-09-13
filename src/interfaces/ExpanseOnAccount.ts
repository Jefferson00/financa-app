export interface CreateExpanseOnAccount {
  userId: string;
  expanseId: string;
  accountId: string;
  name: string;
  value: number;
  month: Date;
  recurrence: string;
}

export interface ExpanseOnAccount {
  id: string;
  value: number;
  accountId: string;
  paymentDate: string;
  recurence?: string;
  expanseId: string;
  month: string;
  name: string;
}

export interface ICreateExpanseOnAccount {
  userId: string;
  expanseId: string;
  accountId: string;
  name: string;
  month: Date;
  value: number;
  recurrence: string;
}
