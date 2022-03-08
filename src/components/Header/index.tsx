import React from 'react';
import { useAuth } from '../../hooks/AuthContext';
import { Colors } from '../../styles/global';
import Icons from 'react-native-vector-icons/Ionicons';
import * as S from './styles';

export default function Header() {
  const { user } = useAuth();
  const backgroundColor = Colors.BLUE_PRIMARY_LIGHTER;
  const selectorColor = Colors.ORANGE_PRIMARY_LIGHTER;

  return (
    <S.Container backgroundColor={backgroundColor}>
      <S.MonthSelector>
        <S.PrevButton>
          <Icons name="chevron-back" size={32} color={selectorColor} />
        </S.PrevButton>
        <S.Month color={selectorColor}>Nov 2020</S.Month>
        <S.NextButton>
          <Icons name="chevron-forward" size={32} color={selectorColor} />
        </S.NextButton>
      </S.MonthSelector>
      {user?.avatar ? (
        <S.Avatar source={{ uri: user.avatar }} />
      ) : (
        <S.EmptyAvatar />
      )}
    </S.Container>
  );
}
