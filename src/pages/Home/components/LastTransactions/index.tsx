import React, { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
import { Colors } from '../../../../styles/global';
import * as S from './styles';
import { useTheme } from '../../../../hooks/ThemeContext';
import { useAccount } from '../../../../hooks/AccountContext';
import { isSameMonth } from 'date-fns';

interface ITransactions {
  id: string;
  title: string;
  value: number;
  paymentDate: Date;
  category: string;
  type: 'Expanse' | 'Income';
}

const LastTransactions = () => {
  const { theme } = useTheme();
  const { incomesOnAccounts, expansesOnAccounts } = useAccount();
  const [lastTransactionsState, setLastTransactionsState] = useState<
    ITransactions[]
  >([]);

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

  useEffect(() => {
    const incomesInThisMonth = incomesOnAccounts.filter(i =>
      isSameMonth(new Date(i.month), new Date()),
    );
    const expansesInThisMonth = expansesOnAccounts.filter(i =>
      isSameMonth(new Date(i.month), new Date()),
    );

    const allTransactions = [...incomesInThisMonth, ...expansesInThisMonth];

    const lastTransactions = allTransactions.sort(
      (a, b) => new Date(b.paymentDate) - new Date(a.paymentDate),
    );

    const transactions: ITransactions[] = [];

    lastTransactions.slice(0, 3).map(transaction => {
      transactions.push({
        id: transaction.id,
        category: 'any',
        paymentDate: new Date(transaction.paymentDate),
        title: transaction.name,
        type: transaction?.incomeId ? 'Income' : 'Expanse',
        value: transaction.value,
      });
    });

    setLastTransactionsState(transactions);
  }, [incomesOnAccounts, expansesOnAccounts]);

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

  // const lastTransactions: any[] = [];

  return (
    <>
      {lastTransactionsState.length === 0 ? (
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
                {getDayOfTheMounth(transaction.paymentDate)}
              </S.TransactionDate>
            </S.DetailsContainer>
          </S.LastTransactionsView>
        ))
      )}
    </>
  );
};

export default LastTransactions;
