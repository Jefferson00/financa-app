import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { addMonths, isAfter, isBefore, isSameMonth } from 'date-fns';

import { useTheme } from '../../../../hooks/ThemeContext';
import * as S from './styles';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getEstimateColors } from '../../../../utils/colors/home';
import { getMounthAndYear } from '../../../../utils/dateFormats';
import { Invoice } from 'src/interfaces/CreditCards';
import { useSelector } from 'react-redux';
import State from '../../../../interfaces/State';

interface IEstimate {
  id: string | number;
  month: string;
  value: number;
  indicator: number;
}

const Estimates = () => {
  const { theme } = useTheme();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { incomes, incomesOnAccount } = useSelector(
    (state: State) => state.incomes,
  );
  const { expanses, expansesOnAccount } = useSelector(
    (state: State) => state.expanses,
  );
  const { creditCards } = useSelector((state: State) => state.creditCards);

  const [estimates, setEstimates] = useState<IEstimate[]>([]);

  const colors = getEstimateColors(theme);
  const controller = new AbortController();

  const calculateEstimateBalances = useCallback(() => {
    let count = 0;
    let currentMonth = new Date();
    let sumBalanceLastMonth = 0;

    accounts.map(account => {
      sumBalanceLastMonth = sumBalanceLastMonth + account.balance;
    });

    let estimatesArr = [];
    let balanceInThisMonth = sumBalanceLastMonth;
    let values = [];

    while (count < 5) {
      const incomesInThisMonth = incomes.filter(i =>
        i.endDate
          ? (isBefore(currentMonth, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), currentMonth)) &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth))
          : i.endDate === null &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth)),
      );

      const incomesOnAccountInThisMonth = incomesOnAccount.filter(i =>
        isSameMonth(new Date(i.month), currentMonth),
      );

      const incomesWithoutAccount = incomesInThisMonth.filter(
        i =>
          !incomesOnAccountInThisMonth.find(
            inOnAccount => inOnAccount.incomeId === i.id,
          ),
      );

      const estimateIncomes = incomesWithoutAccount.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );

      const expansesInThisMonth = expanses.filter(i =>
        i.endDate
          ? (isBefore(currentMonth, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), currentMonth)) &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth))
          : i.endDate === null &&
            (isAfter(currentMonth, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), currentMonth)),
      );

      const expansesOnAccountInThisMonth = expansesOnAccount.filter(exp =>
        isSameMonth(new Date(exp.month), currentMonth),
      );

      const invoicesInThisMonth: Invoice[] = [];

      creditCards.map(card => {
        const foundInvoice = card.Invoice.find(
          invoice =>
            isSameMonth(new Date(invoice.month), currentMonth) && invoice.paid,
        );
        if (foundInvoice) invoicesInThisMonth.push(foundInvoice);
      });

      if (invoicesInThisMonth) {
        invoicesInThisMonth.map(invoice => {
          invoice.ExpanseOnInvoice.map(expanse => {
            expansesOnAccountInThisMonth.push(expanse as any);
          });
        });
      }

      const expansesWithoutAccount = expansesInThisMonth.filter(
        i =>
          !expansesOnAccountInThisMonth.find(
            expOnAccount => expOnAccount.expanseId === i.id,
          ),
      );

      const estimateExpanses = expansesWithoutAccount.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );

      balanceInThisMonth =
        balanceInThisMonth + (estimateIncomes - estimateExpanses);
      values.push(balanceInThisMonth);
      estimatesArr.push({
        id: count,
        month: getMounthAndYear(currentMonth),
        value: balanceInThisMonth,
        indicator: 0,
      });
      currentMonth = addMonths(currentMonth, 1);
      count++;
    }

    const maxValue = Math.max.apply(Math, values);

    estimatesArr = estimatesArr.map(e => {
      if (e.value === maxValue && maxValue !== 0) {
        return {
          ...e,
          indicator: 100,
        };
      }
      if (e.value === 0) {
        return {
          ...e,
          indicator: 0,
        };
      }
      return {
        ...e,
        indicator: Math.round((100 * e.value) / maxValue),
      };
    });
    setEstimates(estimatesArr);
  }, [
    accounts,
    incomes,
    expanses,
    incomesOnAccount,
    expansesOnAccount,
    creditCards,
  ]);

  useEffect(() => {
    calculateEstimateBalances();

    return () => {
      controller.abort();
    };
  }, [calculateEstimateBalances]);

  return (
    <S.EstimateView
      backgroundColor={colors.backgroundColor}
      isEmpty={!estimates.find(est => est.value > 0)}>
      <ScrollView
        horizontal
        contentContainerStyle={{
          minWidth: '100%',
          alignItems: 'flex-end',
          justifyContent: 'center',
        }}
        showsHorizontalScrollIndicator={false}>
        {estimates.map(estimate => (
          <S.EstimateInMonth key={estimate.id}>
            <S.EstimateMonthText monthTextColor={colors.estimateColors.month}>
              {estimate.month}
            </S.EstimateMonthText>
            <S.EstimateMonthValue valueTextColor={colors.estimateColors.value}>
              {getCurrencyFormat(estimate.value)}
            </S.EstimateMonthValue>

            <S.EstimateIndicator
              indicatorVelue={estimate.indicator}
              indicatorColor={colors.estimateColors.indicator}
            />
          </S.EstimateInMonth>
        ))}
      </ScrollView>
    </S.EstimateView>
  );
};

export default Estimates;
