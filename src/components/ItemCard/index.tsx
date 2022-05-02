import React from 'react';
import { Switch } from 'react-native';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import * as S from './styles';

interface ItemCardProps {
  icon: React.FC;
  title?: string;
  mainColor?: string;
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  actionBarColor?: string;
  value: number;
}

export default function ItemCard({
  title,
  icon: Icon,
  value,
  mainColor,
  textColor,
  ...rest
}: ItemCardProps) {
  return (
    <S.Container backgroundColor="#C4DCDF">
      <S.Main>
        <S.TitleContainer>
          <Icon />
          <S.TitleText color={textColor ? textColor : '#000'}>
            {title}
          </S.TitleText>
        </S.TitleContainer>

        <S.ValueContainer>
          <S.ValueText color={mainColor ? mainColor : '#000'}>
            {getCurrencyFormat(value)}
          </S.ValueText>
        </S.ValueContainer>
      </S.Main>

      <S.ActionContainer backgroundColor="#FF981E">
        <S.TitleText color={textColor ? textColor : '#000'}>
          Receber
        </S.TitleText>

        <Switch
          trackColor={{ true: textColor, false: textColor }}
          thumbColor={textColor}
          value={false}
        />
      </S.ActionContainer>
    </S.Container>
  );
}
