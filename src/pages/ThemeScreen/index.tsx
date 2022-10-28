import React from 'react';
import Menu from '../../components/Menu';
import * as S from './styles';

import Icon from 'react-native-vector-icons/Ionicons';
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
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { colors } from '../../styles/colors';

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
      [colors.white, colors.dark[900]],
    );

    return { backgroundColor };
  });

  const buttonColorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.white, colors.dark[700]],
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      [colors.blue[600], colors.blue.dark[600]],
    );

    return { backgroundColor, borderColor };
  });

  const buttonTextColorAnimated = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 1],
      [colors.blue[600], colors.blue[100]],
    );

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

  const themeColors = () => {
    if (theme === 'dark') {
      return {
        text: colors.blue[100],
        switch: {
          thumb: {
            true: colors.blue.dark[600],
            false: colors.blue.dark[500],
          },
          track: {
            true: colors.blue.dark[500],
            false: colors.gray[600],
          },
        },
      };
    }
    return {
      text: colors.gray[900],
      switch: {
        thumb: {
          true: colors.blue[600],
          false: colors.blue[500],
        },
        track: {
          true: colors.blue[500],
          false: colors.blue[200],
        },
      },
    };
  };

  return (
    <>
      <ReducedHeader title="Selecionar tema" />
      <S.Container style={[colorAnimated]}>
        <S.ThemeMainContainer>
          <S.ThemeIconContainer style={iconAnimated}>
            <Icon
              name="sunny"
              size={RFPercentage(20)}
              color={colors.orange[400]}
            />
          </S.ThemeIconContainer>
          <S.ThemeIconContainer style={iconMoonAnimated}>
            <Icon
              name="moon"
              size={RFPercentage(20)}
              color={colors.blue[100]}
            />
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
            <S.Title color={themeColors().text}>Padrão do sistema</S.Title>
            <S.Subtitle color={themeColors().text}>
              Usar o tema padrão do dispositivo?
            </S.Subtitle>
          </S.TextContainer>
          <S.Switch
            trackColor={{
              true: themeColors().switch.track.true,
              false: themeColors().switch.track.false,
            }}
            thumbColor={
              defaultDeviceThemeEnable
                ? themeColors().switch.thumb.true
                : themeColors().switch.thumb.false
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
