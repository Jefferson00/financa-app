import React from 'react';
import { ScrollView } from 'react-native';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { Colors } from '../../../../styles/global';
import * as S from './styles';

const Estimates = () => {
  const backgroundColor = Colors.BLUE_SOFT_LIGHTER;

  const estimateColors = {
    month: Colors.MAIN_TEXT_LIGHTER,
    value: Colors.BLUE_SECONDARY_LIGHTER,
    indicator: Colors.ORANGE_SECONDARY_LIGHTER,
  };

  const estimates = [
    {
      id: 1,
      month: 'Nov 20',
      value: 100000,
      indicator: 0,
    },
    {
      id: 2,
      month: 'Dez 20',
      value: 1000000,
      indicator: 30,
    },
    {
      id: 3,
      month: 'Jan 21',
      value: 1000000,
      indicator: 30,
    },
    {
      id: 4,
      month: 'Fev 21',
      value: 1000000,
      indicator: 30,
    },
    {
      id: 5,
      month: 'Mar 21',
      value: 2000000,
      indicator: 60,
    },
  ];

  return (
    <S.EstimateView backgroundColor={backgroundColor}>
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
