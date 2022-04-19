import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../hooks/AuthContext';
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
import { useTheme } from '../../hooks/ThemeContext';

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
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(currentDate);
  const [disableButton, setDisableButton] = useState(false);

  function changeMonth(order: 'PREV' | 'NEXT') {
    return new Promise((resolve, reject) => {
      const currentMonth = selectedDate.getMonth();
      setTimeout(() => {
        setSelectedDate(
          new Date(
            selectedDate.setMonth(
              order === 'NEXT' ? currentMonth + 1 : currentMonth - 1,
            ),
          ),
        );
        resolve(true);
      }, 500);
    });
  }

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
        onPress={() => navigation.navigate('Profile', { id: 'teste' })}>
        {user?.avatar ? (
          <SharedElement id="teste">
            <S.Avatar
              source={{ uri: user.avatar }}
              style={{ borderRadius: 25, width: 50, height: 50 }}
              resizeMode="cover"
            />
          </SharedElement>
        ) : (
          <SharedElement id="teste">
            <S.EmptyAvatar
              style={{
                borderRadius: 25,
                width: 50,
                height: 50,
                backgroundColor: '#d2d2d2',
              }}
            />
          </SharedElement>
        )}
      </Pressable>
    </S.Container>
  );
}
