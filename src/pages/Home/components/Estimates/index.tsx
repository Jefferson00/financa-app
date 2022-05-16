import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { Colors } from '../../../../styles/global';
import * as S from './styles';
import { useTheme } from '../../../../hooks/ThemeContext';
import { useAccount } from '../../../../hooks/AccountContext';
import { addMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import {
  getPreviousMonth,
  getMounthAndYear,
} from '../../../../utils/dateFormats';

interface IEstimate {
  id: string | number;
  month: string;
  value: number;
  indicator: number;
}

const Estimates = () => {
  const { theme } = useTheme();
  const { incomes, expanses, accounts } = useAccount();
  const [estimates, setEstimates] = useState<IEstimate[]>([]);

  const backgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;

  const estimateColors = {
    month:
      theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER,
    value:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    indicator:
      theme === 'dark'
        ? Colors.ORANGE_SECONDARY_DARKER
        : Colors.ORANGE_SECONDARY_LIGHTER,
  };

  useEffect(() => {
    let estimatesArr = [];
    let count = 0;
    let currentMonth = new Date();
    const prevMonth = getPreviousMonth(new Date());
    let sumBalanceLastMonth = 0;

    accounts.map(account => {
      if (account.balances) {
        const balanceLastMonth = account.balances.find(balance =>
          isSameMonth(new Date(balance.month), prevMonth),
        );

        if (balanceLastMonth) {
          sumBalanceLastMonth = sumBalanceLastMonth + balanceLastMonth.value;
        } else {
          sumBalanceLastMonth = sumBalanceLastMonth + account.initialValue;
        }
      }
    });

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

      const estimateIncomes = incomesInThisMonth.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );
      const estimateExpanses = expansesInThisMonth.reduce(
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
  }, [accounts, incomes, expanses]);

  return (
    <S.EstimateView
      backgroundColor={backgroundColor}
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
            <S.EstimateMonthText monthTextColor={estimateColors.month}>
              {estimate.month}
            </S.EstimateMonthText>
            <S.EstimateMonthValue valueTextColor={estimateColors.value}>
              {getCurrencyFormat(estimate.value)}
            </S.EstimateMonthValue>

            <S.EstimateIndicator
              indicatorVelue={estimate.indicator}
              indicatorColor={estimateColors.indicator}
            />
          </S.EstimateInMonth>
        ))}
      </ScrollView>
    </S.EstimateView>
  );
};

export default Estimates;
