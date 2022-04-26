import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
import { Colors } from '../../../../styles/global';
import * as S from './styles';
import { useTheme } from '../../../../hooks/ThemeContext';

const LastTransactions = () => {
  const { theme } = useTheme();

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

  /*  const lastTransactions = [
    {
      id: '1',
      title: 'Compras do mês',
      value: 58590,
      created_at: new Date(),
      category: 'others',
      type: 'expanse',
    },
    {
      id: '2',
      title: 'Beneficio de não sei o que',
      value: 200000,
      created_at: new Date(),
      category: 'others',
      type: 'income',
    },
    {
      id: '3',
      title: 'Minha pika',
      value: 100000,
      created_at: new Date(),
      category: 'others',
      type: 'income',
    },
  ]; */

  const lastTransactions: any[] = [];

  return (
    <>
      {lastTransactions.length === 0 ? (
        <S.LastTransactionsView backgroundColor={backgroundColor}>
          <S.TransactionText color={textColor}>
            Nenhuma transação por enquanto
          </S.TransactionText>
        </S.LastTransactionsView>
      ) : (
        lastTransactions.map(transaction => (
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
                  transaction.type === 'expanse' ? expanseColor : incomeColor
                }>
                {getCurrencyFormat(transaction.value)}
              </S.TransactionValue>
              <S.TransactionDate color={textColor}>
                {getDayOfTheMounth(transaction.created_at)}
              </S.TransactionDate>
            </S.DetailsContainer>
          </S.LastTransactionsView>
        ))
      )}
    </>
  );
};

export default LastTransactions;
