import React from 'react';
import * as S from './styles';

import Icon from 'react-native-vector-icons/Ionicons';
import { ITransactions } from '..';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface LastTransactionItemProps {
  transaction: ITransactions;
}

export function LastTransactionItem({ transaction }: LastTransactionItemProps) {
  return (
    <S.LastTransactionsView>
      <Icon name="business" size={RFPercentage(3)} color="#09192D" />
      <S.TitleContainer>
        <S.TransactionTitle>
          {transaction.title.length > 15
            ? `${transaction.title.substring(0, 16)}...`
            : transaction.title}
        </S.TransactionTitle>
      </S.TitleContainer>

      <S.DetailsContainer>
        <S.TransactionValue
          style={{
            color: transaction.type === 'Expanse' ? '#CC3728' : '#1A8289',
          }}>
          {transaction.type === 'Expanse' && '-'}
          {transaction.valueFormated}
        </S.TransactionValue>
        <S.TransactionDate>
          {getDayOfTheMounth(new Date(transaction.paymentDate))}
        </S.TransactionDate>
      </S.DetailsContainer>
    </S.LastTransactionsView>
  );
}
