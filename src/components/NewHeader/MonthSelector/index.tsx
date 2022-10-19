import React from 'react';
import * as S from './styles';
import Icons from 'react-native-vector-icons/Ionicons';
import { useDate } from '../../../hooks/DateContext';
import { getMounthAndYear } from '../../../utils/dateFormats';
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export function MonthSelector() {
  const { changeMonth, selectedDate } = useDate();
  const textAnimate = useSharedValue(0);
  const textOpacity = useSharedValue(0);

  const textAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(textAnimate.value),
        },
      ],
      opacity: interpolate(textOpacity.value, [0, 1], [1, 0]),
    };
  });

  const handleChangeMonth = async (order: 'PREV' | 'NEXT') => {
    textAnimate.value = withSequence(
      withTiming(order === 'NEXT' ? -300 : 100, { duration: 50 }),
      withTiming(order === 'NEXT' ? 100 : -300),
      withTiming(0, { duration: 50 }),
    );
    textOpacity.value = withSequence(
      withTiming(1),
      withTiming(1),
      withTiming(0, { duration: 50 }),
    );
    await changeMonth(order);
  };

  return (
    <S.MonthSelector>
      <S.PrevButton onPress={() => handleChangeMonth('PREV')}>
        <Icons name="chevron-back" size={32} color="#fff" />
      </S.PrevButton>
      <S.MonthContainer>
        <S.Month style={textAnimated}>{getMounthAndYear(selectedDate)}</S.Month>
      </S.MonthContainer>
      <S.NextButton onPress={() => handleChangeMonth('NEXT')}>
        <Icons name="chevron-forward" size={32} color="#fff" />
      </S.NextButton>
    </S.MonthSelector>
  );
}
