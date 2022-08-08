import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { IAccount } from '../interfaces/Account';
import AsyncStorage from '@react-native-community/async-storage';

interface AccountContextData {
  handleSelectAccount: (account: IAccount) => void;
  accountSelected: IAccount | undefined;
}

export const AccountContext = createContext<AccountContextData>(
  {} as AccountContextData,
);

export const AccountProvider: React.FC = ({ children }) => {
  const [accountSelected, setAccountSelected] = useState<IAccount>();

  const controller = new AbortController();

  const handleSelectAccount = useCallback((account: IAccount) => {
    setAccountSelected(account);
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
        accountSelected,
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
