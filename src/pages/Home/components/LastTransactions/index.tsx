import React, { useEffect, useState, useCallback } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentLoader, { Rect } from 'react-content-loader/native';

import { useAuth } from '../../../../hooks/AuthContext';
import { useTheme } from '../../../../hooks/ThemeContext';

import * as S from './styles';
import api from '../../../../services/api';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
import {
  getHomeColors,
  getLastTransactionsColors,
} from '../../../../utils/colors/home';
import { useSelector } from 'react-redux';
import State from '../../../../interfaces/State';

interface ITransactions {
  id: string;
  title: string;
  value: number;
  paymentDate: Date;
  category: string;
  type: 'Expanse' | 'Income';
}

const LastTransactions = () => {
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
        setLastTransactionsState(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  useEffect(() => {
    getLastTransactions().finally(() => setLoadingData(false));
  }, [getLastTransactions, incomesOnAccount, expansesOnAccount]);

  return (
    <>
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
        <S.LastTransactionsView backgroundColor={colors.backgroundColor}>
          <S.TransactionText color={colors.textColor}>
            Nenhuma transação por enquanto
          </S.TransactionText>
        </S.LastTransactionsView>
      ) : (
        lastTransactionsState.map(transaction => (
          <S.LastTransactionsView
            key={transaction.id}
            backgroundColor={colors.backgroundColor}>
            <Icon name="business" size={32} color={colors.iconColor} />
            <S.TitleContainer>
              <S.TransactionTitle color={colors.textColor}>
                {transaction.title.length > 15
                  ? `${transaction.title.substring(0, 16)}...`
                  : transaction.title}
              </S.TransactionTitle>
            </S.TitleContainer>

            <S.DetailsContainer>
              <S.TransactionValue
                color={
                  transaction.type === 'Expanse'
                    ? colors.expanseColor
                    : colors.incomeColor
                }>
                {transaction.type === 'Expanse' && '-'}
                {getCurrencyFormat(transaction.value)}
              </S.TransactionValue>
              <S.TransactionDate color={colors.textColor}>
                {getDayOfTheMounth(new Date(transaction.paymentDate))}
              </S.TransactionDate>
            </S.DetailsContainer>
          </S.LastTransactionsView>
        ))
      )}
    </>
  );
};

export default LastTransactions;
