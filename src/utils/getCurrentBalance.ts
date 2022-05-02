import { Income } from 'src/interfaces/Income';
import { Account } from '../interfaces/Account';

export function getCurrentBalance(account: Account): number {
  const incomeValuesSum = account.IncomesOnAccounts.reduce(
    (a, b) => a + (b['value'] || 0),
    0,
  );
  const expanseValuesSum = 0;
  return account.initialValue + incomeValuesSum - expanseValuesSum;
}

export function getEstimateIncomes(incomes: Income[]) {
  return incomes.reduce((a, b) => a + (b['value'] || 0), 0);
}
