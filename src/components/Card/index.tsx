import React from 'react';
import * as S from './styles';

interface IColors {
  PRIMARY_BACKGROUND: string;
  SECOND_BACKGROUND: string;
}

interface IValues {
  current: number;
  estimate: number;
}

interface CradsProps {
  icon: React.FC<any>;
  title: string;
  colors: IColors;
  values?: IValues;
  type?: 'ADD' | null;
}

export default function Card({
  colors,
  icon: Icon,
  title,
  values,
  type,
}: CradsProps) {
  return (
    <S.Container
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={[colors.PRIMARY_BACKGROUND, colors.SECOND_BACKGROUND]}>
      {!type && (
        <>
          <S.CardInfo>
            <S.CardTitle>{title}</S.CardTitle>
            <S.CardBalance>R$ {values?.current}</S.CardBalance>
            <S.CardSubBalance>Previsto R$ {values?.estimate}</S.CardSubBalance>
          </S.CardInfo>

          <S.IconContainer>
            <Icon />
          </S.IconContainer>
        </>
      )}
      {type === 'ADD' && (
        <S.AddCardContainer>
          <S.CardTitle>{title}</S.CardTitle>
          <S.AddButton>
            <Icon />
          </S.AddButton>
        </S.AddCardContainer>
      )}
    </S.Container>
  );
}
