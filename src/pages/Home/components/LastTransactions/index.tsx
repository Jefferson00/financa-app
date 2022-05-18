import React, { useEffect, useState, useCallback } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
import { Colors } from '../../../../styles/global';
import * as S from './styles';
import { useTheme } from '../../../../hooks/ThemeContext';
import api from '../../../../services/api';
import { useAuth } from '../../../../hooks/AuthContext';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { Dimensions } from 'react-native';
import { getHomeColors } from '../../../../utils/colors/home';

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
  const [lastTransactionsState, setLastTransactionsState] = useState<
    ITransactions[]
  >([]);
  const [loadingData, setLoadingData] = useState(true);

  const colors = getHomeColors(theme);

  const iconColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const backgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const expanseColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const incomeColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;

  const getLastTransactions = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`users/lastTransactions/${user?.id}`);
        console.log(data);
        setLastTransactionsState(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, [user]);

  useEffect(() => {
    getLastTransactions().finally(() => setLoadingData(false));
  }, [getLastTransactions]);

  return (
    <>
      {loadingData ? (
        <ContentLoader
          viewBox={`0 0 ${width} 80`}
          height={80}
          width={'100%'}
          backgroundColor={colors.secondaryColor}
          foregroundColor="rgb(255, 255, 255)">
          <Rect x="0" y="0" rx="20" ry="20" width={width} height="80" />
        </ContentLoader>
      ) : lastTransactionsState.length === 0 ? (
        <S.LastTransactionsView backgroundColor={backgroundColor}>
          <S.TransactionText color={textColor}>
            Nenhuma transação por enquanto
          </S.TransactionText>
        </S.LastTransactionsView>
      ) : (
        lastTransactionsState.map(transaction => (
          <S.LastTransactionsView
            key={transaction.id}
            backgroundColor={backgroundColor}>
            <Icon name="business" size={32} color={iconColor} />
            <S.TitleContainer>
              <S.TransactionTitle color={textColor}>
                {transaction.title.length > 15
                  ? `${transaction.title.substring(0, 16)}...`
                  : transaction.title}
              </S.TransactionTitle>
            </S.TitleContainer>

            <S.DetailsContainer>
              <S.TransactionValue
                color={
                  transaction.type === 'Expanse' ? expanseColor : incomeColor
                }>
                {getCurrencyFormat(transaction.value)}
              </S.TransactionValue>
              <S.TransactionDate color={textColor}>
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
