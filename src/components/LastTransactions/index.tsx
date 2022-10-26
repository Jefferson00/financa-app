import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';
import api from '../../services/api';
import * as S from './styles';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { LastTransactionItem } from './LastTransactionItem';
import { colors } from '../../styles/colors';

export interface ITransactions {
  id: string;
  title: string;
  value: number;
  valueFormated: string;
  paymentDate: Date;
  category: string;
  type: 'Expanse' | 'Income';
}

export function LastTransactions() {
  const width = Dimensions.get('screen').width;
  const { theme } = useTheme();
  const { user } = useAuth();
  const { incomesOnAccount } = useSelector((state: State) => state.incomes);
  const { expansesOnAccount } = useSelector((state: State) => state.expanses);
  const [lastTransactionsState, setLastTransactionsState] = useState<
    ITransactions[]
  >([]);
  const [loadingData, setLoadingData] = useState(true);

  const getLastTransactions = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`users/lastTransactions/${user?.id}`);
        const formated = data.map((item: ITransactions) => {
          return {
            ...item,
            valueFormated: getCurrencyFormat(item.value),
          };
        });
        setLastTransactionsState(formated);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  const lastTransitionsColors = () => {
    if (theme === 'dark') {
      return {
        text: colors.gray[200],
        loading: {
          background: colors.dark[700],
          foreground: colors.gray[600],
        },
      };
    }
    return {
      text: colors.gray[600],
      loading: {
        background: colors.blue[200],
        foreground: colors.white,
      },
    };
  };

  useEffect(() => {
    getLastTransactions().finally(() => setLoadingData(false));
  }, [getLastTransactions, incomesOnAccount, expansesOnAccount]);

  return (
    <S.LastTransactions>
      <S.Title color={lastTransitionsColors().text}>Últimas Transações</S.Title>

      {loadingData ? (
        <ContentLoader
          viewBox={`0 0 ${width} 80`}
          height={80}
          width={'100%'}
          backgroundColor={lastTransitionsColors().loading.background}
          foregroundColor={lastTransitionsColors().loading.foreground}>
          <Rect x="0" y="0" rx="20" ry="20" width={width} height="80" />
        </ContentLoader>
      ) : lastTransactionsState.length === 0 ? (
        <S.LastTransactionsView>
          <S.TransactionText color={lastTransitionsColors().text}>
            Nenhuma transação por enquanto
          </S.TransactionText>
        </S.LastTransactionsView>
      ) : (
        lastTransactionsState.map(transaction => (
          <LastTransactionItem key={transaction.id} transaction={transaction} />
        ))
      )}
    </S.LastTransactions>
  );
}
