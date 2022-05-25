import React from 'react';
import Menu from '../../components/Menu';
import * as S from './styles';

import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { useTheme } from '../../hooks/ThemeContext';

import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withSequence,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getThemeScreenColors } from '../../utils/colors/theme';

interface ProfileProps {
  id: string;
}

export default function ThemeScreen({ id }: ProfileProps) {
  const {
    theme,
    handleChangeTheme,
    defaultDeviceThemeEnable,
    handleToggleDefaultThemeEnable,
  } = useTheme();

  const colors = getThemeScreenColors(theme);

  const iconAnimateX = useSharedValue(theme === 'dark' ? -2000 : 0);
  const iconAnimateY = useSharedValue(theme === 'dark' ? 2000 : 0);

  const iconMoonAnimateX = useSharedValue(theme === 'dark' ? 0 : -2000);
  const iconMoonAnimateY = useSharedValue(theme === 'dark' ? 0 : 2000);

  const textOpacity = useSharedValue(theme === 'dark' ? 1 : 0);
  const iconMoonOpacity = useSharedValue(theme === 'dark' ? 0 : 1);

  const progress = useDerivedValue(() => {
    return theme === 'dark'
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [theme]);

  const iconAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(iconAnimateX.value),
        },
        {
          translateY: withTiming(iconAnimateY.value),
        },
      ],
      opacity: interpolate(textOpacity.value, [0, 1], [1, 0]),
    };
  });

  const iconMoonAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withTiming(iconMoonAnimateX.value),
        },
        {
          translateY: withTiming(iconMoonAnimateY.value),
        },
      ],
      opacity: interpolate(iconMoonOpacity.value, [0, 1], [1, 0]),
    };
  });

  const colorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#1C1C1C'],
    );

    return { backgroundColor };
  });

  const buttonColorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#262626'],
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#3C93F9', '#4876AC'],
    );

    return { backgroundColor, borderColor };
  });

  const buttonTextColorAnimated = useAnimatedStyle(() => {
    const color = interpolateColor(progress.value, [0, 1], ['#3C93F9', '#fff']);

    return { color };
  });

  const handleTheme = (theme: 'dark' | 'light') => {
    handleChangeTheme(theme);
    if (theme === 'dark') {
      iconAnimateX.value = withSequence(
        withTiming(2000, { duration: 1000 }),
        withTiming(-2000, { duration: 50 }),
      );
      iconAnimateY.value = withSequence(
        withTiming(-2000, { duration: 1000 }),
        withTiming(2000, { duration: 50 }),
      );

      iconMoonAnimateX.value = withTiming(0, { duration: 1000 });
      iconMoonAnimateY.value = withTiming(0, { duration: 1000 });

      textOpacity.value = withTiming(1, { duration: 1000 });
      iconMoonOpacity.value = withTiming(0, { duration: 1000 });
    } else {
      iconAnimateX.value = withTiming(0, { duration: 500 });
      iconAnimateY.value = withTiming(0, { duration: 500 });
      textOpacity.value = withTiming(0, { duration: 1000 });

      iconMoonAnimateX.value = withSequence(
        withTiming(2000, { duration: 1000 }),
        withTiming(-2000, { duration: 50 }),
      );
      iconMoonAnimateY.value = withSequence(
        withTiming(-2000, { duration: 1000 }),
        withTiming(2000, { duration: 50 }),
      );

      iconMoonOpacity.value = withTiming(1, { duration: 1000 });
    }
  };

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container style={[colorAnimated]}>
        <S.MainTitle color={colors.titleColor}>Selecionar tema</S.MainTitle>
        <S.ThemeMainContainer>
          <S.ThemeIconContainer style={iconAnimated}>
            <Icon name="sunny" size={RFPercentage(20)} color="#FF981E" />
          </S.ThemeIconContainer>
          <S.ThemeIconContainer style={iconMoonAnimated}>
            <Icon name="moon" size={RFPercentage(20)} color="#ffffff" />
          </S.ThemeIconContainer>
          <S.ButtonContainer style={[buttonColorAnimated]}>
            {theme === 'dark' ? (
              <S.Button
                style={{ marginTop: 32 }}
                onPress={() => handleTheme('light')}>
                <S.ButtonText style={[buttonTextColorAnimated]}>
                  Mudar para tema claro
                </S.ButtonText>
              </S.Button>
            ) : (
              <S.Button
                style={{ marginTop: 32 }}
                onPress={() => handleTheme('dark')}>
                <S.ButtonText style={[buttonTextColorAnimated]}>
                  Mudar para tema escuro
                </S.ButtonText>
              </S.Button>
            )}
          </S.ButtonContainer>
        </S.ThemeMainContainer>

        <S.ConfigCard color={theme === 'dark' ? '#c5c5c5' : '#d2d2d2'}>
          <S.TextContainer>
            <S.Title color={colors.textColor}>Padrão do sistema</S.Title>
            <S.Subtitle color={colors.textColor}>
              Usar o tema padrão do dispositivo?
            </S.Subtitle>
          </S.TextContainer>
          <S.Switch
            trackColor={{
              true: colors.trackColor,
              false: colors.falseTrackColor,
            }}
            thumbColor={
              defaultDeviceThemeEnable
                ? colors.thumbColor
                : colors.falseThumbColor
            }
            value={defaultDeviceThemeEnable}
            onChange={handleToggleDefaultThemeEnable}
          />
        </S.ConfigCard>
      </S.Container>
      <Menu />
    </>
  );
}
