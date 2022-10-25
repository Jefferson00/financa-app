import React, { useEffect } from 'react';
import { ScrollView } from 'react-native';

import * as S from './styles';

import { useTheme } from '../../../hooks/ThemeContext';
import { getEstimateColors } from '../../../utils/colors/home';
import { useAccount } from '../../../hooks/AccountContext';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';

const Estimate = () => {
  const { theme } = useTheme();
  const {
    calculateEstimateBalances,
    estimates,
    handleSelectEstimate,
    estimateMonthSelected,
  } = useAccount();

  const colors = getEstimateColors(theme);
  const controller = new AbortController();

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
            <S.EstimateIndicator
              indicatorVelue={estimate.indicator}
              indicatorColor={
                estimateMonthSelected === estimate.month ? '#FF981E' : '#EFF6FF'
              }
              onPress={() =>
                handleSelectEstimate(
                  getCurrencyFormat(estimate.value),
                  estimate.month,
                )
              }
            />
            <S.EstimateMonthText monthTextColor={colors.estimateColors.month}>
              {estimate.month}
            </S.EstimateMonthText>
          </S.EstimateInMonth>
        ))}
      </ScrollView>
    </S.EstimateView>
  );
};

export default Estimate;
