import { AccountState } from '../store/modules/Accounts';
import { IncomesState } from '../store/modules/Incomes';
import { CreditCardsState } from '../store/modules/CreditCards';
import { ExpansesState } from '../store/modules/Expanses';

export default interface State {
  accounts: AccountState;
  incomes: IncomesState;
  expanses: ExpansesState;
  creditCards: CreditCardsState;
}
