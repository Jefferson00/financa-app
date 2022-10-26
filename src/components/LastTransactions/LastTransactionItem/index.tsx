import React from 'react';
import * as S from './styles';

import { ITransactions } from '..';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getCategoryIcon } from '../../../utils/getCategoryIcon';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../../../styles/colors';

interface LastTransactionItemProps {
  transaction: ITransactions;
}

export function LastTransactionItem({ transaction }: LastTransactionItemProps) {
  const { theme } = useTheme();

  const lastTransitionItemColors = () => {
    if (theme === 'dark') {
      return {
        text: colors.blue[100],
        background: colors.dark[700],
        value: {
          expanse: colors.red.dark[500],
          income: colors.green.dark[500],
        },
        date: colors.gray[200],
      };
    }
    return {
      text: colors.gray[900],
      background: colors.blue[100],
      value: {
        expanse: colors.red[500],
        income: colors.green[500],
      },
      date: colors.gray[300],
    };
  };

  return (
    <S.LastTransactionsView
      backgroundColor={lastTransitionItemColors().background}>
      {getCategoryIcon(
        transaction.category,
        lastTransitionItemColors().text,
        RFPercentage(3),
      )}
      <S.TitleContainer>
        <S.TransactionTitle color={lastTransitionItemColors().text}>
          {transaction.title.length > 15
            ? `${transaction.title.substring(0, 16)}...`
            : transaction.title}
        </S.TransactionTitle>
      </S.TitleContainer>

      <S.DetailsContainer>
        <S.TransactionValue
          color={
            transaction.type === 'Expanse'
              ? lastTransitionItemColors().value.expanse
              : lastTransitionItemColors().value.income
          }>
          {transaction.type === 'Expanse' && '-'}
          {transaction.valueFormated}
        </S.TransactionValue>
        <S.TransactionDate color={lastTransitionItemColors().date}>
          {getDayOfTheMounth(new Date(transaction.paymentDate))}
        </S.TransactionDate>
      </S.DetailsContainer>
    </S.LastTransactionsView>
  );
}
