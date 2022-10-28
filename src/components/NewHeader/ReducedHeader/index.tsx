import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Pressable } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Nav } from '../../../routes';
import { Avatar } from '../Avatar';
import Icons from 'react-native-vector-icons/Ionicons';
import * as S from './styles';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../../../styles/colors';

interface HeaderProps {
  title: string;
  variant?: 'income' | 'expanse';
  showAvatar?: boolean;
}

export function ReducedHeader({
  title,
  variant,
  showAvatar = true,
}: HeaderProps) {
  const navigation = useNavigation<Nav>();
  const { theme } = useTheme();

  const headerColors = () => {
    if (theme === 'dark') {
      return {
        default: [colors.dark[800], colors.dark[800]],
        income: [colors.dark[800], colors.dark[800]],
        expanse: [colors.dark[800], colors.dark[800]],
      };
    }
    return {
      default: [colors.blue[600], colors.blue[700]],
      income: [colors.green[500], colors.green[600]],
      expanse: [colors.red[500], colors.red[600]],
    };
  };

  return (
    <S.Container>
      <S.Gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        colors={
          variant === 'income'
            ? headerColors().income
            : variant === 'expanse'
            ? headerColors().expanse
            : headerColors().default
        }>
        <S.Row>
          <Pressable onPress={() => navigation.goBack()}>
            <S.GoBack>
              <Icons name="arrow-back" size={32} color="#fff" />
            </S.GoBack>
          </Pressable>

          {showAvatar && <Avatar />}
        </S.Row>

        <S.Title>{title}</S.Title>
      </S.Gradient>
    </S.Container>
  );
}
