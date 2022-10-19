import React from 'react';
import {
  Extrapolate,
  interpolate,
  SharedValue,
  useAnimatedStyle,
} from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Avatar } from './Avatar';
import { Balances } from './Balances';
import { MonthSelector } from './MonthSelector';
import * as S from './styles';

interface HeaderProps {
  headerValue: SharedValue<number>;
  values: {
    current: string;
    estimate: string;
  };
  titles: {
    current: string;
    estimate: string;
  };
  colors: string[];
  variant?: 'income' | 'expanse';
}

export function Header({
  headerValue,
  colors,
  values,
  titles,
  variant,
}: HeaderProps) {
  const HEADER_MAX_HEIGHT = RFPercentage(36);
  const HEADER_MIN_HEIGHT = RFPercentage(22);
  const BORDER_RAIDUS = RFPercentage(6);

  const animateHeaderHeight = useAnimatedStyle(() => {
    return {
      height: interpolate(
        headerValue.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
        Extrapolate.CLAMP,
      ),
      borderBottomRightRadius: interpolate(
        headerValue.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [BORDER_RAIDUS, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const animateTextOpacity = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        headerValue.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [1, 0],
        Extrapolate.CLAMP,
      ),
    };
  });

  const animateReducedText = useAnimatedStyle(() => {
    return {
      opacity: interpolate(
        headerValue.value,
        [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
        [0, 1],
        Extrapolate.CLAMP,
      ),
      transform: [
        {
          translateY: interpolate(
            headerValue.value,
            [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
            [100, 0],
            Extrapolate.CLAMP,
          ),
        },
      ],
    };
  });

  return (
    <S.Container style={animateHeaderHeight}>
      <S.Gradient start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} colors={colors}>
        <S.Row>
          <MonthSelector />
          <Avatar />
        </S.Row>

        <Balances
          variant={variant}
          titles={titles}
          values={values}
          animateTextOpacity={animateTextOpacity}
          animateReducedText={animateReducedText}
        />
      </S.Gradient>
    </S.Container>
  );
}
