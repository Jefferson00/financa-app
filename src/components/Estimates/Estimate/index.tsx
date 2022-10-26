import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';

import * as S from './styles';

import { useTheme } from '../../../hooks/ThemeContext';
import { useAccount } from '../../../hooks/AccountContext';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import { colors } from '../../../styles/colors';

const Estimate = () => {
  const { theme } = useTheme();
  const {
    calculateEstimateBalances,
    estimates,
    handleSelectEstimate,
    estimateMonthSelected,
  } = useAccount();

  const controller = new AbortController();

  const estimateColors = () => {
    if (theme === 'dark') {
      return {
        indicator: {
          selected: colors.orange.dark[500],
          unselected: colors.dark[700],
        },
        text: colors.blue[100],
      };
    }
    return {
      indicator: {
        selected: colors.orange[500],
        unselected: colors.blue[100],
      },
      text: colors.gray[900],
    };
  };

  const getIndicatorColor = (month: string) => {
    if (estimateMonthSelected === month) {
      return estimateColors().indicator.selected;
    }
    return estimateColors().indicator.unselected;
  };

  useEffect(() => {
    calculateEstimateBalances();

    return () => {
      controller.abort();
    };
  }, [calculateEstimateBalances]);

  useEffect(() => {
    if (estimates.length > 0) {
      handleSelectEstimate(estimates[0].valueFormated, estimates[0].month);
    }
  }, [estimates]);

  return (
    <S.EstimateView isEmpty={!estimates.find(est => est.value > 0)}>
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
            <S.EstimateIndicator
              indicatorVelue={estimate.indicator}
              indicatorColor={getIndicatorColor(estimate.month)}
              onPress={() =>
                handleSelectEstimate(
                  getCurrencyFormat(estimate.value),
                  estimate.month,
                )
              }
            />
            <S.EstimateMonthText monthTextColor={estimateColors().text}>
              {estimate.month}
            </S.EstimateMonthText>
          </S.EstimateInMonth>
        ))}
      </ScrollView>
    </S.EstimateView>
  );
};

export default Estimate;
