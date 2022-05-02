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
import { getCurrentBalance } from '../utils/getCurrentBalance';

interface AccountContextData {
  getUserAccounts: () => Promise<void>;
  getUserIncomes: () => Promise<void>;
  accounts: Account[];
  incomes: Income[];
  isLoadingData: boolean;
  accountCards: any[];
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
  const [accountCards, setAccountCards] = useState([defaultAccountCard]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const controller = new AbortController();

  const getUserAccounts = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`accounts/user/${user.id}`);
        setAccounts(data);
        // console.log('accounts loaded');
      } catch (error) {
        //console.log(error);
      }
    }
  }, [user]);

  const getUserIncomes = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(
          `incomes/user/${user.id}/${selectedDate}`,
        );
        setIncomes(data);
        // console.log('incomes loaded', data);
      } catch (error) {
        // console.log(error);
      }
    }
  }, [selectedDate, user, selectedDate]);

  const handleAccountCardMount = useCallback(() => {
    const cardsArray: any[] = [];
    accounts.map((account, index) => {
      if (account.status === 'active') {
        const currentBalance = getCurrentBalance(account);

        cardsArray.push({
          id: index + 1,
          title: account.name,
          type: account.type,
          current_balance: currentBalance,
          estimate_balance: 0,
          account,
        });
      }
    });
    cardsArray.push({
      id: accounts.length + 1,
      title: 'Adicionar uma nova conta',
      type: 'ADD',
      current_balance: 0,
      estimate_balance: 0,
    });
    setAccountCards(cardsArray);
  }, [accounts]);

  useEffect(() => {
    setIsLoadingData(true);
    getUserAccounts().finally(() =>
      getUserIncomes().finally(() => {
        setIsLoadingData(false);
      }),
    );

    return () => {
      controller.abort();
    };
  }, [selectedDate, getUserAccounts, getUserIncomes]);

  useEffect(() => {
    handleAccountCardMount();
  }, [accounts]);

  return (
    <AccountContext.Provider
      value={{
        getUserAccounts,
        getUserIncomes,
        accounts,
        incomes,
        isLoadingData,
        accountCards,
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
