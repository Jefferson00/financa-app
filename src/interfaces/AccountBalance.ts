export interface CreateAccountBalance {
  month: string;
  value: number;
  accountId: string;
}

export interface AccountBalance {
  id: string;
  month: string;
  value: number;
  accountId: string;
  createdAt?: string;
  updatedAt?: string;
}
