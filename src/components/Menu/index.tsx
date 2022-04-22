import React from 'react';
import * as S from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/global';
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../routes';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';

export default function Menu() {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();
  const iconColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;

  const progress = useDerivedValue(() => {
    return theme === 'dark'
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [theme]);

  const buttonAnimate = useSharedValue(0);

  const buttonAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(buttonAnimate.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const colorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#262626'],
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#d2d2d2', '#262626'],
    );

    return { backgroundColor, borderColor };
  });

  return (
    <>
      <S.Container
        style={[
          {
            shadowOpacity: 0.25,
            shadowRadius: 2,
            shadowOffset: {
              width: 0,
              height: 2,
            },
            shadowColor: '#000000',
            elevation: 20,
            borderWidth: 1,
            borderColor: '#d2d2d2',
          },
          colorAnimated,
        ]}>
        <S.MenuButton
          isActive
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}
          onPressIn={() => (buttonAnimate.value = withTiming(1))}
          onPressOut={() => {
            buttonAnimate.value = withTiming(0);
            navigation.navigate('Home');
          }}>
          <S.AnimatedView style={buttonAnimated}>
            <Icon name="home" size={RFPercentage(5.2)} color={iconColor} />
          </S.AnimatedView>
        </S.MenuButton>

        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon
            name="arrow-up-circle"
            size={RFPercentage(5.2)}
            color={iconColor}
          />
        </S.MenuButton>
        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon
            name="arrow-down-circle"
            size={RFPercentage(5.2)}
            color={iconColor}
          />
        </S.MenuButton>
        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon
            name="notifications"
            size={RFPercentage(5.2)}
            color={iconColor}
          />
        </S.MenuButton>
      </S.Container>
    </>
  );
}
