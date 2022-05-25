import { Income } from '../interfaces/Income';
import { IncomeOnAccount } from '../interfaces/IncomeOnAccount';
import { ExpanseOnAccount } from '../interfaces/ExpanseOnAccount';
import { Expanse } from '../interfaces/Expanse';

/* export function getCurrentBalance(account: Account): number {
  const incomeValuesSum = account.IncomesOnAccounts.reduce(
    (a, b) => a + (b['value'] || 0),
    0,
  );
  const expanseValuesSum = 0;
  return account.initialValue + incomeValuesSum - expanseValuesSum;
} */
export function getCurrentBalance(
  incomesOnAccounts: IncomeOnAccount[],
  expansesOnAccounts: ExpanseOnAccount[],
): number {
  const incomeValuesSum = incomesOnAccounts.reduce(
    (a, b) => a + (b['value'] || 0),
    0,
  );
  const expanseValuesSum = expansesOnAccounts.reduce(
    (a, b) => a + (b['value'] || 0),
    0,
  );
  return incomeValuesSum - expanseValuesSum;
}

export function getEstimateBalance(
  incomes: Income[],
  expanses: Expanse[],
  currentBalance: number,
): number {
  const incomeValuesSum = incomes.reduce((a, b) => a + (b['value'] || 0), 0);
  const expanseValuesSum = expanses.reduce((a, b) => a + (b['value'] || 0), 0);
  return incomeValuesSum + currentBalance - expanseValuesSum;
}

export function getCurrentIncomes(incomes: IncomeOnAccount[]) {
  return incomes.reduce((a, b) => a + (b['value'] || 0), 0);
}

export function getCurrentExpanses(expanse: ExpanseOnAccount[]) {
  return expanse.reduce((a, b) => a + (b['value'] || 0), 0);
}

export function getEstimateIncomes(incomes: Income[]) {
  return incomes.reduce((a, b) => a + (b['value'] || 0), 0);
}
