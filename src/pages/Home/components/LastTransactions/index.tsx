import React from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
import { Colors } from '../../../../styles/global';
import * as S from './styles';

const LastTransactions = () => {
  const backgroundColor = Colors.BLUE_SOFT_LIGHTER;

  const lastTransactions = [
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
  ];

  return (
    <>
      {lastTransactions.length === 0 ? (
        <S.LastTransactionsView backgroundColor={backgroundColor}>
          <S.TransactionText>Nenhuma transação por enquanto</S.TransactionText>
        </S.LastTransactionsView>
      ) : (
        lastTransactions.map(transaction => (
          <S.LastTransactionsView
            key={transaction.id}
            backgroundColor={backgroundColor}>
            <Icon name="business" size={32} color="#2673CE" />
            <S.TitleContainer>
              <S.TransactionTitle>
                {transaction.title.length > 15
                  ? `${transaction.title.substring(0, 16)}...`
                  : transaction.title}
              </S.TransactionTitle>
            </S.TitleContainer>

            <S.DetailsContainer>
              <S.TransactionValue
                color={transaction.type === 'expanse' ? '#CC3728' : '#28cc3e'}>
                {getCurrencyFormat(transaction.value)}
              </S.TransactionValue>
              <S.TransactionDate>
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
