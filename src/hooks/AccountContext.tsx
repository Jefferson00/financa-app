import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IAccount } from '../interfaces/Account';
import AsyncStorage from '@react-native-community/async-storage';
import { addMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import { useDate } from './DateContext';
import { useSelector } from 'react-redux';
import State from '../interfaces/State';
import { getAccountEstimateBalance } from '../utils/getAccountBalance';
import { getCurrencyFormat } from '../utils/getCurrencyFormat';
import { Invoice } from '../interfaces/CreditCards';
import { getMounthAndYear } from '../utils/dateFormats';

interface AccountContextData {
  handleSelectAccount: (account: IAccount) => void;
  listAccountCards: () => Promise<void>;
  calculateEstimateBalances: () => void;
  handleSelectEstimate: (value: string, month: string) => void;
  estimates: IEstimate[];
  accountSelected: IAccount | undefined;
  accountCards: IAccountCard[];
  loadingCards: boolean;
  totalEstimateBalance: string;
  totalCurrentBalance: string;
  estimateValueSelected: string;
  estimateMonthSelected: string;
}

export const AccountContext = createContext<AccountContextData>(
  {} as AccountContextData,
);

export interface IAccountCard {
  title: string;
  isDefault: boolean;
  currentBalance: number;
  estimateBalance: number;
  account: IAccount | null;
}

const defaultAccountCard: IAccountCard = {
  title: 'Adicionar uma nova conta',
  isDefault: true,
  currentBalance: 0,
  estimateBalance: 0,
  account: null,
};

interface IEstimate {
  id: string | number;
  month: string;
  value: number;
  valueFormated: string;
  indicator: number;
  active: boolean;
}

export const AccountProvider: React.FC = ({ children }) => {
  const { selectedDate } = useDate();
  const { accounts, loading: loadingAccount } = useSelector(
    (state: State) => state.accounts,
  );
  const { incomes, incomesOnAccount } = useSelector(
    (state: State) => state.incomes,
  );
  const { expanses, expansesOnAccount } = useSelector(
    (state: State) => state.expanses,
  );
  const { creditCards } = useSelector((state: State) => state.creditCards);
  const [accountSelected, setAccountSelected] = useState<IAccount>();
  const [accountCards, setAccountCards] = useState([defaultAccountCard]);
  const [totalEstimateBalance, setTotalEstimateBalance] = useState(
    getCurrencyFormat(0),
  );
  const [totalCurrentBalance, setTotalCurrentBalance] = useState(
    getCurrencyFormat(0),
  );
  const [loadingCards, setLoadingCards] = useState(true);
  const [estimates, setEstimates] = useState<IEstimate[]>([]);
  const [estimateValueSelected, setEstimateValueSelected] = useState(
    getCurrencyFormat(0),
  );
  const [estimateMonthSelected, setEstimateMonthSelected] = useState('');

  const controller = new AbortController();

  const handleSelectAccount = useCallback((account: IAccount) => {
    setAccountSelected(account);
  }, []);

  const handleSelectEstimate = (value: string, month: string) => {
    setEstimateValueSelected(value);
    setEstimateMonthSelected(month);
  };

  const listAccountCards = async () => {
    setLoadingCards(true);
    let sumTotalCurrentBalance = 0;
    let sumTotalEstimateBalance = 0;

    const cardsArray: any[] = [];
    const isTheSameMonth = isSameMonth(new Date(), selectedDate);

    await Promise.all(
      accounts.map(async (account, index) => {
        const currentBalance = account.balance;

        const lastMonthEstimateBalance = await AsyncStorage.getItem(
          `@FinancaAppBeta:LastMonthEstimateBalance@${account.id}`,
        );

        const estimateBalance = isTheSameMonth
          ? getAccountEstimateBalance(
              account,
              currentBalance,
              incomes,
              expanses,
              selectedDate,
              creditCards,
            )
          : getAccountEstimateBalance(
              account,
              Number(lastMonthEstimateBalance),
              incomes,
              expanses,
              selectedDate,
              creditCards,
            );

        const currentMonthEstimateBalance = await AsyncStorage.getItem(
          `@FinancaAppBeta:CurrentMonthEstimateBalance@${account.id}@${selectedDate}`,
        );

        if (!currentMonthEstimateBalance) {
          await AsyncStorage.setItem(
            `@FinancaAppBeta:CurrentMonthEstimateBalance@${account.id}@${selectedDate}`,
            String(estimateBalance),
          );
        }

        sumTotalCurrentBalance = sumTotalCurrentBalance + currentBalance;
        sumTotalEstimateBalance =
          isTheSameMonth || !currentMonthEstimateBalance
            ? sumTotalEstimateBalance + estimateBalance
            : sumTotalEstimateBalance + Number(currentMonthEstimateBalance);

        cardsArray.push({
          id: index + 1,
          title: account.name,
          isDefault: false,
          type: account.type,
          currentBalance: getCurrencyFormat(currentBalance),
          estimateBalance:
            isTheSameMonth || !currentMonthEstimateBalance
              ? getCurrencyFormat(estimateBalance)
              : getCurrencyFormat(Number(currentMonthEstimateBalance)),
          account,
        });
      }),
    );

    cardsArray.push({
      id: accounts.length + 1,
      title: 'Adicionar uma nova conta',
      type: 'Add',
      currentBalance: 0,
      estimateBalance: 0,
      isDefault: true,
    });

    setTotalCurrentBalance(getCurrencyFormat(sumTotalCurrentBalance));
    setTotalEstimateBalance(getCurrencyFormat(sumTotalEstimateBalance));
    setAccountCards(cardsArray);
  };

  const calculateEstimateBalances = useCallback(() => {
    let count = 0;
    let currentMonth = new Date();
    let sumBalanceLastMonth = 0;

    accounts.map(account => {
      sumBalanceLastMonth = sumBalanceLastMonth + account.balance;
    });

    let estimatesArr = [];
    let balanceInThisMonth = sumBalanceLastMonth;
    let values = [];

    while (count < 5) {
      const incomesInThisMonth = incomes.filter(i =>
        i.endDate
          ? (isBefore(currentMonth, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), currentMonth)) &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth))
          : i.endDate === null &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth)),
      );

      const incomesOnAccountInThisMonth = incomesOnAccount.filter(i =>
        isSameMonth(new Date(i.month), currentMonth),
      );

      const incomesWithoutAccount = incomesInThisMonth.filter(
        i =>
          !incomesOnAccountInThisMonth.find(
            inOnAccount => inOnAccount.incomeId === i.id,
          ),
      );

      const estimateIncomes = incomesWithoutAccount.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );

      const expansesInThisMonth = expanses.filter(i =>
        i.endDate
          ? (isBefore(currentMonth, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), currentMonth)) &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth))
          : i.endDate === null &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth)),
      );

      const expansesOnAccountInThisMonth = expansesOnAccount.filter(exp =>
        isSameMonth(new Date(exp.month), currentMonth),
      );

      const invoicesInThisMonth: Invoice[] = [];

      creditCards.map(card => {
        const foundInvoice = card.Invoice.find(
          invoice =>
            isSameMonth(new Date(invoice.month), currentMonth) && invoice.paid,
        );
        if (foundInvoice) invoicesInThisMonth.push(foundInvoice);
      });

      if (invoicesInThisMonth) {
        invoicesInThisMonth.map(invoice => {
          invoice.ExpanseOnInvoice.map(expanse => {
            expansesOnAccountInThisMonth.push(expanse as any);
          });
        });
      }

      const expansesWithoutAccount = expansesInThisMonth.filter(
        i =>
          !expansesOnAccountInThisMonth.find(
            expOnAccount => expOnAccount.expanseId === i.id,
          ),
      );

      const estimateExpanses = expansesWithoutAccount.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );

      balanceInThisMonth =
        balanceInThisMonth + (estimateIncomes - estimateExpanses);
      values.push(balanceInThisMonth);
      estimatesArr.push({
        id: count,
        month: getMounthAndYear(currentMonth),
        value: balanceInThisMonth,
        indicator: 0,
      });
      currentMonth = addMonths(currentMonth, 1);
      count++;
    }

    const maxValue = Math.max.apply(Math, values);

    estimatesArr = estimatesArr.map(e => {
      if (e.value === maxValue && maxValue !== 0) {
        return {
          ...e,
          valueFormated: getCurrencyFormat(e.value),
          indicator: 100,
          active: true,
        };
      }
      if (e.value === 0) {
        return {
          ...e,
          valueFormated: getCurrencyFormat(e.value),
          indicator: 0,
          active: false,
        };
      }
      return {
        ...e,
        valueFormated: getCurrencyFormat(e.value),
        indicator: Math.round((100 * e.value) / maxValue),
        active: false,
      };
    });
    setEstimates(estimatesArr);
  }, [
    accounts,
    incomes,
    expanses,
    incomesOnAccount,
    expansesOnAccount,
    creditCards,
  ]);

  useEffect(() => {
    if (!loadingAccount && accounts.length === accountCards.length - 1) {
      setLoadingCards(false);
    }
  }, [loadingAccount, accounts, accountCards]);

  useEffect(() => {
    AsyncStorage.getAllKeys().then(keys => {
      AsyncStorage.multiGet(keys).then(async items => {
        await Promise.all(
          items.map(async item => {
            if (
              item[0].startsWith('@FinancaAppBeta:CurrentMonthEstimateBalance')
            ) {
              await AsyncStorage.removeItem(item[0]);
            }
          }),
        );
      });
    });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <AccountContext.Provider
      value={{
        handleSelectAccount,
        listAccountCards,
        calculateEstimateBalances,
        handleSelectEstimate,
        accountSelected,
        accountCards,
        loadingCards,
        totalCurrentBalance,
        totalEstimateBalance,
        estimates,
        estimateValueSelected,
        estimateMonthSelected,
      }}>
      {children}
    </AccountContext.Provider>
  );
};

export function useAccount(): AccountContextData {
  const context = useContext(AccountContext);

  if (!context) {
    throw new Error('useAccount must be used within an AccountProvider');
  }
  return context;
}
