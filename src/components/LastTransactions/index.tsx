import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';
import api from '../../services/api';
import * as S from './styles';
import ContentLoader, { Rect } from 'react-content-loader/native';
import {
  getHomeColors,
  getLastTransactionsColors,
} from '../../utils/colors/home';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../utils/dateFormats';
import { LastTransactionItem } from './LastTransactionItem';

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

  const homeColors = getHomeColors(theme);
  const colors = getLastTransactionsColors(theme);

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

  useEffect(() => {
    getLastTransactions().finally(() => setLoadingData(false));
  }, [getLastTransactions, incomesOnAccount, expansesOnAccount]);

  return (
    <S.LastTransactions>
      <S.BalanceText>Últimas Transações</S.BalanceText>

      {loadingData ? (
        <ContentLoader
          viewBox={`0 0 ${width} 80`}
          height={80}
          width={'100%'}
          backgroundColor={homeColors.secondaryColor}
          foregroundColor="rgb(255, 255, 255)">
          <Rect x="0" y="0" rx="20" ry="20" width={width} height="80" />
        </ContentLoader>
      ) : lastTransactionsState.length === 0 ? (
        <S.LastTransactionsView>
          <S.TransactionText color={colors.textColor}>
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
