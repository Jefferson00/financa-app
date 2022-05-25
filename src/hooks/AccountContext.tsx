import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';
import { Account } from '../interfaces/Account';
import { useAuth } from './AuthContext';
import { useDate } from './DateContext';
import { Income } from '../interfaces/Income';
import {
  getCurrentBalance,
  getEstimateBalance,
} from '../utils/getCurrentBalance';
import {
  CreateIncomeOnAccount,
  IncomeOnAccount,
} from '../interfaces/IncomeOnAccount';
import { Expanse } from '../interfaces/Expanse';
import {
  CreateExpanseOnAccount,
  ExpanseOnAccount,
} from '../interfaces/ExpanseOnAccount';
import { isAfter, isBefore, isSameMonth, lastDayOfMonth } from 'date-fns';
import { getPreviousMonth } from '../utils/dateFormats';
import { AccountBalance } from '../interfaces/AccountBalance';
import AsyncStorage from '@react-native-community/async-storage';
import { CreditCards } from '../interfaces/CreditCards';

interface AccountContextData {
  getUserAccounts: () => Promise<void>;
  getUserIncomes: () => Promise<void>;
  getUserIncomesOnAccount: () => Promise<void>;
  getUserExpansesOnAccount: () => Promise<void>;
  getUserExpanses: () => Promise<void>;
  handleCreateIncomeOnAccount: (
    createIncomeOnAccount: CreateIncomeOnAccount,
  ) => Promise<void>;
  handleSelectAccount: (account: Account) => void;
  handleUpdateAccountBalance: (
    accountLastBalance: AccountBalance | undefined,
    value: number,
    account: Account | undefined,
    type: 'Income' | 'Expanse',
  ) => Promise<void>;
  handleCreateExpanseOnAccount: (
    createExpanseOnAccount: CreateExpanseOnAccount,
  ) => Promise<void>;
  handleClearCache: () => void;
  getUserCreditCards: () => Promise<void>;
  accounts: Account[];
  incomes: Income[];
  expanses: Expanse[];
  incomesOnAccounts: IncomeOnAccount[];
  expansesOnAccounts: ExpanseOnAccount[];
  isLoadingData: boolean;
  isLoadingCards: boolean;
  hasAccount: boolean;
  accountCards: any[];
  totalEstimateBalance: number;
  totalCurrentBalance: number;
  accountSelected: Account | undefined;
  creditCards: CreditCards[];
}

export const AccountContext = createContext<AccountContextData>(
  {} as AccountContextData,
);

const defaultAccountCard = {
  id: 0,
  title: 'Adicionar uma nova conta',
  type: 'ADD',
  current_balance: 0,
  estimate_balance: 0,
};

export const AccountProvider: React.FC = ({ children }) => {
  const { user } = useAuth();
  const { selectedDate } = useDate();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [accountSelected, setAccountSelected] = useState<Account>();
  const [totalEstimateBalance, setTotalEstimateBalance] = useState(0);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState(0);
  const [accountCards, setAccountCards] = useState([defaultAccountCard]);
  const [creditCards, setCreditCards] = useState<CreditCards[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [expanses, setExpanses] = useState<Expanse[]>([]);
  const [cacheCleared, setCacheCleared] = useState(false);
  const [incomesOnAccounts, setIncomesOnAccounts] = useState<IncomeOnAccount[]>(
    [],
  );
  const [expansesOnAccounts, setExpansesOnAccounts] = useState<
    ExpanseOnAccount[]
  >([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [hasAccount, setHasAccount] = useState(false);
  const controller = new AbortController();

  const handleSelectAccount = useCallback((account: Account) => {
    setAccountSelected(account);
  }, []);

  const getUserAccounts = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`accounts/user/${user.id}`);

        await Promise.all(
          data.map(async (account: Account) => {
            const response = await api.get(`accounts/balance/${account.id}`);

            Object.assign(account, {
              balances: response.data,
            });
          }),
        );
        setAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserCreditCards = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`creditCards/user/${user.id}`);
        setCreditCards(data);
        console.log('invoices', data[0].Invoice.length);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserIncomes = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`incomes/user/${user.id}`);
        setIncomes(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserExpanses = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`expanses/user/${user.id}`);
        setExpanses(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserIncomesOnAccount = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`incomes/onAccount/${user.id}`);
        setIncomesOnAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserExpansesOnAccount = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`expanses/onAccount/${user.id}`);
        setExpansesOnAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const handleUpdateAccountBalance = useCallback(
    async (
      accountLastBalance: AccountBalance | undefined,
      value: number,
      account: Account | undefined,
      type: 'Income' | 'Expanse',
    ) => {
      if (accountLastBalance) {
        const { data } = await api.put(
          `accounts/balance/${accountLastBalance.id}`,
          {
            value:
              type === 'Income'
                ? accountLastBalance.value + value
                : accountLastBalance.value - value,
            accountId: account?.id,
          },
        );
        //console.log('update balance: ', data);
      } else {
        const { data } = await api.post(`accounts/balance`, {
          month: selectedDate,
          value: account?.initialValue
            ? type === 'Income'
              ? account?.initialValue + value
              : account?.initialValue - value
            : value,
          accountId: account?.id,
        });
        //console.log('create balance: ', data);
      }
      await getUserAccounts();
    },
    [selectedDate, getUserAccounts],
  );

  const handleCreateIncomeOnAccount = useCallback(
    async (createIncomeOnAccount: CreateIncomeOnAccount) => {
      if (user) {
        try {
          const { data } = await api.post(
            `incomes/onAccount`,
            createIncomeOnAccount,
          );
        } catch (error) {
          console.log(error);
        }
      }
    },
    [user],
  );

  const handleCreateExpanseOnAccount = useCallback(
    async (createExpanseOnAccount: CreateExpanseOnAccount) => {
      if (user) {
        try {
          const { data } = await api.post(
            `expanses/onAccount`,
            createExpanseOnAccount,
          );
        } catch (error) {
          console.log(error);
        }
      }
    },
    [user],
  );

  const getAccountCurrentBalance = useCallback(
    (account: Account) => {
      let currentBalance = 0;

      const incomesInThisMonth = incomesOnAccounts.filter(i =>
        isSameMonth(new Date(i.month), selectedDate),
      );
      const expansesInThisMonth = expansesOnAccounts.filter(i =>
        isSameMonth(new Date(i.month), selectedDate),
      );

      const incomesInThisAccount = incomesInThisMonth.filter(
        i => i.accountId === account.id,
      );
      const expansesInThisAccount = expansesInThisMonth.filter(
        i => i.accountId === account.id,
      );

      const selectedMonth = new Date(selectedDate);

      const accountBalanceLastMonth = account?.balances?.find(b =>
        isSameMonth(new Date(b.month), getPreviousMonth(selectedMonth)),
      );

      const currentMonth = lastDayOfMonth(new Date());
      currentMonth.setUTCHours(23, 59, 59, 999);

      const isAfterCurrentMonth = isAfter(selectedDate, currentMonth);

      if (isAfterCurrentMonth) {
        const accountBalanceLastMonth = account?.balances?.find(b =>
          isSameMonth(new Date(b.month), getPreviousMonth(currentMonth)),
        );

        currentBalance = accountBalanceLastMonth
          ? accountBalanceLastMonth.value +
            getCurrentBalance(incomesInThisAccount, expansesInThisAccount)
          : account.initialValue +
            getCurrentBalance(incomesInThisAccount, expansesInThisAccount);
      } else {
        currentBalance = accountBalanceLastMonth
          ? accountBalanceLastMonth.value +
            getCurrentBalance(incomesInThisAccount, expansesInThisAccount)
          : account.initialValue +
            getCurrentBalance(incomesInThisAccount, expansesInThisAccount);
      }

      return {
        currentBalance,
        incomesInThisAccount,
        expansesInThisAccount,
      };
    },
    [incomesOnAccounts, expansesOnAccounts, selectedDate],
  );

  const getAccountEstimateBalance = useCallback(
    async (
      account: Account,
      currentBalance: number,
      incomesOnAccountInThisMonth: IncomeOnAccount[],
      expansesOnAccountInThisMonth: ExpanseOnAccount[],
    ) => {
      const incomesInThisMonth = incomes.filter(i =>
        i.endDate
          ? (isBefore(selectedDate, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), selectedDate)) &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate))
          : i.endDate === null &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate)),
      );

      const expansesInThisMonth = expanses.filter(i =>
        i.endDate
          ? (isBefore(selectedDate, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), selectedDate)) &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate))
          : i.endDate === null &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate)),
      );

      const incomesWithoutAccount = incomesInThisMonth.filter(
        i =>
          !incomesOnAccountInThisMonth.find(
            inOnAccount => inOnAccount.incomeId === i.id,
          ),
      );

      const expansesWithoutAccount = expansesInThisMonth.filter(
        e =>
          !expansesOnAccountInThisMonth.find(
            exOnAccount => exOnAccount.expanseId === e.id,
          ),
      );

      const allIncomesInThisAccount = incomesWithoutAccount.filter(
        i => i.receiptDefault === account.id,
      );

      //buscar todas despesas da conta e dos cartões da conta
      const allExpansesInThisAccount = expansesWithoutAccount.filter(
        i =>
          i.receiptDefault === account.id ||
          creditCards.find(
            card =>
              card.id === i.receiptDefault &&
              card.receiptDefault === account.id,
          ),
      );

      /* console.log('allIncomesInThisAccount', allIncomesInThisAccount);
      console.log('allExpansesInThisAccount', allExpansesInThisAccount);
      console.log('currentBalance', currentBalance); */

      const estimateBalance = getEstimateBalance(
        allIncomesInThisAccount,
        allExpansesInThisAccount,
        currentBalance,
      );

      await AsyncStorage.setItem(
        `@FinancaAppBeta:LastMonthEstimateBalance@${account.id}`,
        String(estimateBalance),
      );
      //console.log('estimateBalance', estimateBalance);
      return estimateBalance;
    },
    [incomes, selectedDate, expanses, creditCards],
  );

  const handleAccountCardMount = useCallback(async () => {
    setIsLoadingCards(true);
    const cardsArray: any[] = [];
    let sumTotalCurrentBalance = 0;
    let sumTotalEstimateBalance = 0;

    await Promise.all(
      accounts.map(async (account, index) => {
        if (account.status === 'active') {
          const {
            currentBalance,
            expansesInThisAccount,
            incomesInThisAccount,
          } = getAccountCurrentBalance(account);

          const isTheSameMonth = isSameMonth(new Date(), selectedDate);

          const lastMonthEstimateBalance = await AsyncStorage.getItem(
            `@FinancaAppBeta:LastMonthEstimateBalance@${account.id}`,
          );

          //console.log('lastMonthEstimateBalance', lastMonthEstimateBalance);
          //console.log('balances', account?.balances);

          const estimateBalance = isTheSameMonth
            ? await getAccountEstimateBalance(
                account,
                currentBalance,
                incomesInThisAccount,
                expansesInThisAccount,
              )
            : await getAccountEstimateBalance(
                account,
                Number(lastMonthEstimateBalance),
                incomesInThisAccount,
                expansesInThisAccount,
              );

          // console.log('estimateBalance', estimateBalance);
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
            type: account.type,
            current_balance: currentBalance,
            estimate_balance:
              isTheSameMonth || !currentMonthEstimateBalance
                ? estimateBalance
                : currentMonthEstimateBalance,
            account,
          });
        }
      }),
    );
    cardsArray.push({
      id: accounts.length + 1,
      title: 'Adicionar uma nova conta',
      type: 'ADD',
      current_balance: 0,
      estimate_balance: 0,
    });
    setTotalCurrentBalance(sumTotalCurrentBalance);
    setTotalEstimateBalance(sumTotalEstimateBalance);
    setAccountCards(cardsArray);
    setIsLoadingCards(false);
  }, [accounts, getAccountCurrentBalance, getAccountEstimateBalance]);

  const handleClearCache = useCallback(() => {
    setCacheCleared(false);
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
        setCacheCleared(true);
      });
    });
  }, []);

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
        setCacheCleared(true);
      });
    });
    setIsLoadingData(true);
    getUserAccounts().finally(() =>
      getUserIncomes().finally(() => {
        getUserIncomesOnAccount().finally(() =>
          getUserExpanses().finally(() =>
            getUserExpansesOnAccount().finally(() =>
              getUserCreditCards().finally(() => setIsLoadingData(false)),
            ),
          ),
        );
      }),
    );

    return () => {
      controller.abort();
    };
  }, [
    getUserAccounts,
    getUserIncomes,
    getUserIncomesOnAccount,
    getUserExpansesOnAccount,
    getUserExpanses,
    getUserCreditCards,
  ]);

  useEffect(() => {
    if (cacheCleared && !isLoadingData) {
      handleAccountCardMount();
    }
  }, [accounts, handleAccountCardMount, cacheCleared, isLoadingData]);

  useEffect(() => {
    if (accounts.length > 0 && accounts.find(acc => acc.status === 'active')) {
      setHasAccount(true);
    }
  }, [accounts]);

  return (
    <AccountContext.Provider
      value={{
        getUserAccounts,
        getUserIncomes,
        getUserIncomesOnAccount,
        handleCreateIncomeOnAccount,
        handleSelectAccount,
        handleUpdateAccountBalance,
        handleCreateExpanseOnAccount,
        getUserExpansesOnAccount,
        getUserExpanses,
        handleClearCache,
        getUserCreditCards,
        expansesOnAccounts,
        accounts,
        isLoadingCards,
        incomes,
        expanses,
        incomesOnAccounts,
        isLoadingData,
        accountCards,
        totalCurrentBalance,
        totalEstimateBalance,
        accountSelected,
        hasAccount,
        creditCards,
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
