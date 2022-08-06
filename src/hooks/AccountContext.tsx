import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import api from '../services/api';
import { IAccount } from '../interfaces/Account';
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
  getActiveUserAccounts: () => Promise<void>;
  getUserIncomes: () => Promise<void>;
  getUserIncomesOnAccount: () => Promise<void>;
  getUserExpansesOnAccount: () => Promise<void>;
  getUserExpanses: () => Promise<void>;
  handleCreateIncomeOnAccount: (
    createIncomeOnAccount: CreateIncomeOnAccount,
  ) => Promise<void>;
  handleSelectAccount: (account: IAccount) => void;
  handleCreateExpanseOnAccount: (
    createExpanseOnAccount: CreateExpanseOnAccount,
  ) => Promise<void>;
  handleClearCache: () => void;
  getUserCreditCards: () => Promise<void>;
  setIncomes: React.Dispatch<React.SetStateAction<Income[]>>;
  setIncomesOnAccounts: React.Dispatch<React.SetStateAction<IncomeOnAccount[]>>;
  setExpanses: React.Dispatch<React.SetStateAction<Expanse[]>>;
  setExpansesOnAccounts: React.Dispatch<
    React.SetStateAction<ExpanseOnAccount[]>
  >;
  handleDeleteIncomeOnAccount: (incomeId: string) => Promise<void>;
  handleDeleteExpanseOnAccount: (expanseId: string) => Promise<void>;
  accounts: IAccount[];
  activeAccounts: IAccount[];
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
  accountSelected: IAccount | undefined;
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
  const [accounts, setAccounts] = useState<IAccount[]>([]);
  const [activeAccounts, setActiveAccounts] = useState<IAccount[]>([]);
  const [accountSelected, setAccountSelected] = useState<IAccount>();
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

  const handleSelectAccount = useCallback((account: IAccount) => {
    setAccountSelected(account);
  }, []);

  const getActiveUserAccounts = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`accounts/active/user/${user.id}`);
        setActiveAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserAccounts = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`accounts/all/user/${user.id}`);

        await Promise.all(
          data.map(async (account: IAccount) => {
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
        const { data } = await api.get(`incomesOnAccount/user/${user.id}`);
        setIncomesOnAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const getUserExpansesOnAccount = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`expansesOnAccount/user/${user.id}`);
        setExpansesOnAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const handleCreateIncomeOnAccount = useCallback(
    async (createIncomeOnAccount: CreateIncomeOnAccount) => {
      if (user) {
        try {
          const { data } = await api.post(
            `incomesOnAccount`,
            createIncomeOnAccount,
          );
          getActiveUserAccounts();
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
            `expansesOnAccount`,
            createExpanseOnAccount,
          );
          getActiveUserAccounts();
        } catch (error) {
          console.log(error);
        }
      }
    },
    [user],
  );

  const handleDeleteIncomeOnAccount = useCallback(
    async (incomeId: string) => {
      if (user) {
        await api.delete(`incomesOnAccount/${incomeId}/${user.id}`);
        await getUserIncomesOnAccount();
        await getActiveUserAccounts();
      }
    },
    [user],
  );

  const handleDeleteExpanseOnAccount = useCallback(
    async (expanseId: string) => {
      if (user) {
        try {
          await api.delete(`expansesOnAccount/${expanseId}/${user.id}`);
          await getActiveUserAccounts();
          await getUserExpansesOnAccount();
        } catch (error) {
          console.log(error);
        }
      }
    },
    [user],
  );

  const getAccountEstimateBalance = useCallback(
    async (
      account: IAccount,
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

    // em todas as contas eu verificaria:
    // o saldo da conta
    // e o saldo previsto que seria: saldo da conta + saldo dos não recebidos (mês atual)
    // (mês futuro) saldo previsto mês anterior + saldo previsto mês atual

    await Promise.all(
      activeAccounts.map(async (account, index) => {
        const currentBalance = account.balance;

        const incomesInThisMonth = account.incomesOnAccount.filter(i =>
          isSameMonth(new Date(i.month), selectedDate),
        );
        const expansesInThisMonth = account.expansesOnAccount.filter(exp =>
          isSameMonth(new Date(exp.month), selectedDate),
        );

        const invoicesInThisMonth = account.Invoice.filter(inv =>
          isSameMonth(new Date(inv.month), selectedDate),
        );

        invoicesInThisMonth.map(invoice => {
          invoice.ExpanseOnInvoice.map(expanse => {
            expansesInThisMonth.push(expanse as any);
          });
        });

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
              incomesInThisMonth,
              expansesInThisMonth,
            )
          : await getAccountEstimateBalance(
              account,
              Number(lastMonthEstimateBalance),
              incomesInThisMonth,
              expansesInThisMonth,
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
  }, [activeAccounts, getAccountEstimateBalance]);

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
    getActiveUserAccounts().finally(() =>
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
    getActiveUserAccounts,
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
  }, [handleAccountCardMount, cacheCleared, isLoadingData]);

  useEffect(() => {
    if (activeAccounts.length > 0) {
      setHasAccount(true);
    } else {
      setHasAccount(false);
    }
  }, [activeAccounts]);

  return (
    <AccountContext.Provider
      value={{
        getUserAccounts,
        getUserIncomes,
        getUserIncomesOnAccount,
        handleCreateIncomeOnAccount,
        handleSelectAccount,
        handleCreateExpanseOnAccount,
        getUserExpansesOnAccount,
        getUserExpanses,
        handleClearCache,
        getUserCreditCards,
        setIncomes,
        setIncomesOnAccounts,
        setExpanses,
        setExpansesOnAccounts,
        handleDeleteExpanseOnAccount,
        handleDeleteIncomeOnAccount,
        getActiveUserAccounts,
        expansesOnAccounts,
        accounts,
        activeAccounts,
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
