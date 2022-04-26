export enum AccountTypes {
  'Conta Corrente',
  'Conta Poupança',
  'Outro',
}

export interface Account {
  id?: string;
  name: string;
  status: string;
  type: AccountTypes;
  initialValue: number;
}
