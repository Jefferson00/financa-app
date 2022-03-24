import React, { forwardRef } from 'react';
import LinearGradient from 'react-native-linear-gradient';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
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
  id: string;
}

const Card = forwardRef(
  (
    { colors, icon: Icon, title, type, values, id }: CradsProps,
    ref: React.Ref<LinearGradient> | undefined,
  ) => (
    <S.Container
      ref={ref}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={[colors.PRIMARY_BACKGROUND, colors.SECOND_BACKGROUND]}
      id={id}>
      {!type && (
        <>
          <S.CardInfo>
            <S.CardTitle>{title}</S.CardTitle>
            <S.CardBalance>
              {getCurrencyFormat(values?.current || 0)}
            </S.CardBalance>
            <S.CardSubBalance>
              Previsto {getCurrencyFormat(values?.estimate || 0)}
            </S.CardSubBalance>
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
  ),
);

export default Card;