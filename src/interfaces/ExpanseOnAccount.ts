export interface CreateExpanseOnAccount {
  userId: string;
  expanseId: string;
  accountId: string;
  value: number;
  month: Date;
  recurrence: string;
}

export interface ExpanseOnAccount {
  value: number;
  accountId: string;
  paymentDate: string;
  recurence?: string;
  expanseId: string;
  month: string;
}
