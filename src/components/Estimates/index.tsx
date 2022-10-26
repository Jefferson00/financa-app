import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { useAccount } from '../../hooks/AccountContext';
import * as S from './styles';
import { Dimensions } from 'react-native';
import Estimate from './Estimate';
import { useTheme } from '../../hooks/ThemeContext';
import { colors } from '../../styles/colors';

export function Estimates() {
  const width = Dimensions.get('screen').width;
  const { theme } = useTheme();

  const { loadingCards, estimateValueSelected } = useAccount();
  const { loading: loadingAccounts } = useSelector(
    (state: State) => state.accounts,
  );
  const { loading: loadingIncomes } = useSelector(
    (state: State) => state.incomes,
  );
  const { loading: loadingExpanses } = useSelector(
    (state: State) => state.expanses,
  );
  const { loading: loadingCreditCards } = useSelector(
    (state: State) => state.creditCards,
  );

  const loadingAll = () => {
    return (
      loadingAccounts ||
      loadingIncomes ||
      loadingExpanses ||
      loadingCreditCards ||
      loadingCards
    );
  };

  const estimatesColors = () => {
    if (theme === 'dark') {
      return {
        loading: {
          background: colors.dark[700],
          foreground: colors.gray[600],
        },
        title: colors.gray[200],
        value: colors.blue[100],
      };
    }
    return {
      loading: {
        background: colors.blue[200],
        foreground: colors.white,
      },
      title: colors.gray[600],
      value: colors.gray[900],
    };
  };

  return (
    <S.Container>
      <S.BalanceText color={estimatesColors().title}>Estimativas</S.BalanceText>

      {loadingAll() ? (
        <ContentLoader
          viewBox={`0 0 ${width} 200`}
          height={200}
          width={width}
          backgroundColor={estimatesColors().loading.background}
          foregroundColor={estimatesColors().loading.foreground}>
          <Rect x="0" y="0" rx="4" ry="4" width="150" height="20" />
          <Rect x="0" y="40" rx="8" ry="8" width="60" height="150" />
          <Rect x="80" y="40" rx="8" ry="8" width="60" height="150" />
          <Rect x="160" y="40" rx="8" ry="8" width="60" height="150" />
          <Rect x="240" y="40" rx="8" ry="8" width="60" height="150" />
        </ContentLoader>
      ) : (
        <>
          <S.BalanceValue color={estimatesColors().value}>
            {estimateValueSelected}
          </S.BalanceValue>
          <Estimate />
        </>
      )}
    </S.Container>
  );
}
