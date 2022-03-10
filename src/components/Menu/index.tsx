import React from 'react';
import * as S from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/global';

export default function Menu() {
  const backgroundColor = '#fff';
  const iconColor = Colors.BLUE_PRIMARY_LIGHTER;
  return (
    <>
      <S.Container
        backgroundColor={backgroundColor}
        style={{
          shadowOpacity: 0.25,
          shadowRadius: 2,
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowColor: '#000000',
          elevation: 20,
        }}>
        <S.MenuButton
          isActive
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon name="home" size={36} color={iconColor} />
        </S.MenuButton>
        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon name="arrow-up-circle" size={36} color={iconColor} />
        </S.MenuButton>
        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon name="arrow-down-circle" size={36} color={iconColor} />
        </S.MenuButton>
        <S.MenuButton
          isActive={false}
          hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}>
          <Icon name="notifications" size={36} color={iconColor} />
        </S.MenuButton>
      </S.Container>
    </>
  );
}
