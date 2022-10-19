import React from 'react';
import { PressableProps } from 'react-native';
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
} from 'react-native-reanimated';
import * as S from './styles';

interface ButtonProps extends PressableProps {
  icon: React.FC;
  title: string;
  colors: ButtonColors;
  fontSize?: 'small' | 'default';
}

export interface ButtonColors {
  PRIMARY_BACKGROUND: string;
  SECOND_BACKGROUND: string;
  BORDER?: string;
  TEXT: string;
}

export default function Button({
  title,
  icon: Icon,
  colors,
  fontSize,
  ...rest
}: ButtonProps) {
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

  return (
    <S.Pressable
      onPressIn={() => (buttonAnimate.value = withTiming(1))}
      onPressOut={() => (buttonAnimate.value = withTiming(0))}
      {...rest}>
      <S.Container style={buttonAnimated}>
        <S.Main backgroundColor={colors.PRIMARY_BACKGROUND}>
          {fontSize === 'small' ? (
            <S.SubText color={colors.TEXT}>{title}</S.SubText>
          ) : (
            <S.MainText color={colors.TEXT}>{title}</S.MainText>
          )}
        </S.Main>

        <S.Icon backgroundColor={colors.SECOND_BACKGROUND}>
          <Icon />
        </S.Icon>
      </S.Container>
    </S.Pressable>
  );
}
