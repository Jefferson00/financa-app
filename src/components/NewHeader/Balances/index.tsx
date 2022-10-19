import React from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useSelector } from 'react-redux';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAccount } from '../../../hooks/AccountContext';
import State from '../../../interfaces/State';
import { colors } from '../../../styles/colors';
import * as S from './styles';

interface BalanceProps {
  title: string;
  value: string;
  isEstimate?: boolean;
  variant?: 'income' | 'expanse';
}

function Balance({ title, value, isEstimate = false, variant }: BalanceProps) {
  const { theme } = useTheme();
  const { loadingCards } = useAccount();

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

  const balanceColors = () => {
    if (theme === 'dark') {
      return {
        title: colors.blue[200],
        value: colors.orange.dark[400],
      };
    }
    return {
      title: colors.white,
      value: colors.orange[400],
    };
  };

  const loadingColors = () => {
    if (theme === 'dark') {
      return {
        background: colors.dark[700],
        foreground: colors.gray[600],
      };
    }
    return {
      background:
        variant === 'expanse'
          ? colors.red[500]
          : variant === 'income'
          ? colors.green[500]
          : colors.blue[600],
      foreground:
        variant === 'expanse'
          ? colors.red[400]
          : variant === 'income'
          ? colors.green[400]
          : colors.blue[400],
    };
  };

  const loadingAll = () => {
    return (
      loadingAccounts ||
      loadingIncomes ||
      loadingExpanses ||
      loadingCreditCards ||
      loadingCards
    );
  };

  return (
    <View>
      <S.BalanceText
        color={balanceColors().title}
        fontSize={isEstimate ? 1.8 : 2}
        fontWeight="Medium">
        {title}
      </S.BalanceText>

      {loadingAll() ? (
        <ContentLoader
          viewBox={`0 0 116 20`}
          height={20}
          width={116}
          style={{ marginTop: RFPercentage(1.3) }}
          backgroundColor={loadingColors().background}
          foregroundColor={loadingColors().foreground}>
          <Rect x="0" y="0" rx="4" ry="4" width={116} height="20" />
        </ContentLoader>
      ) : (
        <S.BalanceText
          color={balanceColors().value}
          fontSize={isEstimate ? 2 : 3}
          fontWeight="SemiBold">
          {value}
        </S.BalanceText>
      )}
    </View>
  );
}

interface BalancesProps {
  animateTextOpacity: {
    opacity: number;
  };
  animateReducedText?: {};
  values: {
    current: string;
    estimate: string;
  };
  titles: {
    current: string;
    estimate: string;
  };
  variant?: 'income' | 'expanse';
}

export function Balances({
  animateTextOpacity,
  animateReducedText,
  values,
  titles,
  variant,
}: BalancesProps) {
  return (
    <>
      <Animated.View
        style={[
          {
            marginTop: RFPercentage(2),
            paddingHorizontal: RFPercentage(1.8),
          },
          animateTextOpacity,
        ]}>
        <Balance
          variant={variant}
          title={titles.current}
          value={values.current}
        />
        <View
          style={{
            marginTop: RFPercentage(1.8),
          }}>
          <Balance
            variant={variant}
            title={titles.estimate}
            value={values.estimate}
            isEstimate
          />
        </View>
      </Animated.View>

      <Animated.View
        style={[
          {
            paddingVertical: RFPercentage(2),
            paddingHorizontal: RFPercentage(4),
            flexDirection: 'row',
            position: 'absolute',
            bottom: 0,
          },
          animateReducedText,
        ]}>
        <Balance
          variant={variant}
          title={titles.current}
          value={values.current}
          isEstimate
        />
        <View
          style={{
            marginLeft: RFPercentage(4),
          }}>
          <Balance
            variant={variant}
            title={titles.estimate}
            value={values.estimate}
            isEstimate
          />
        </View>
      </Animated.View>
    </>
  );
}
