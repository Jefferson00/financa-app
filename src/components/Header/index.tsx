import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';
import { Colors } from '../../styles/global';
import Icons from 'react-native-vector-icons/Ionicons';
import * as S from './styles';
import { getMounthAndYear } from '../../utils/dateFormats';
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../routes';
import { SharedElement } from 'react-navigation-shared-element';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface HeaderProps {
  reduced?: boolean;
  showMonthSelector?: boolean;
}

export default function Header({
  reduced = false,
  showMonthSelector = true,
}: HeaderProps) {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { theme } = useTheme();
  const { changeMonth, selectedDate } = useDate();
  const backgroundColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const currentMonthColor =
    theme === 'dark'
      ? Colors.ORANGE_PRIMARY_DARKER
      : Colors.ORANGE_PRIMARY_LIGHTER;
  const monthColor = theme === 'dark' ? '#C5C5C5' : '#ffffff';

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

  const [selectorColor, setSelectorColor] = useState(currentMonthColor);

  const [disableButton, setDisableButton] = useState(false);

  const handleChangeMonth = useCallback(
    async (order: 'PREV' | 'NEXT') => {
      setDisableButton(true);
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
      setDisableButton(false);
    },
    [selectedDate],
  );

  useEffect(() => {
    if (
      selectedDate.getMonth() + 1 === new Date().getMonth() + 1 &&
      selectedDate.getFullYear() === new Date().getFullYear()
    ) {
      setSelectorColor(currentMonthColor);
    } else {
      setSelectorColor(monthColor);
    }
  }, [selectedDate]);

  return (
    <S.Container backgroundColor={backgroundColor} reduced={reduced}>
      {showMonthSelector ? (
        <S.MonthSelector>
          <S.PrevButton
            onPress={() => handleChangeMonth('PREV')}
            disabled={disableButton}>
            <Icons name="chevron-back" size={32} color={selectorColor} />
          </S.PrevButton>
          <S.MonthContainer>
            <S.Month color={selectorColor} style={textAnimated}>
              {getMounthAndYear(selectedDate)}
            </S.Month>
          </S.MonthContainer>
          <S.NextButton
            onPress={() => handleChangeMonth('NEXT')}
            disabled={disableButton}>
            <Icons name="chevron-forward" size={32} color={selectorColor} />
          </S.NextButton>
        </S.MonthSelector>
      ) : (
        <Pressable onPress={() => navigation.goBack()}>
          <S.GoBack>
            <Icons name="arrow-back" size={32} color={monthColor} />
          </S.GoBack>
        </Pressable>
      )}

      <Pressable
        onPress={() => navigation.navigate('Profile', { id: 'avatar' })}>
        {user?.avatar ? (
          <SharedElement id="avatar">
            <S.Avatar
              source={{ uri: user.avatar }}
              style={{
                borderRadius: RFPercentage(4),
                width: RFPercentage(8),
                height: RFPercentage(8),
              }}
              resizeMode="cover"
            />
          </SharedElement>
        ) : (
          <SharedElement id="avatar">
            <S.EmptyAvatar
              style={{
                borderRadius: RFPercentage(4),
                width: RFPercentage(8),
                height: RFPercentage(8),
                backgroundColor: '#d2d2d2',
              }}
            />
          </SharedElement>
        )}
      </Pressable>
    </S.Container>
  );
}
