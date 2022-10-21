import React, { useEffect, useRef } from 'react';
import { View } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { IAccountCard } from '../../../hooks/AccountContext';
import Ionicon from 'react-native-vector-icons/Ionicons';
import * as S from './styles';
import LinearGradient from 'react-native-linear-gradient';

interface CradsProps {
  icon: React.FC<any>;
  item: IAccountCard;
  handleNavigate?: () => void;
  colors: string[];
}

export function Card({ icon: Icon, item, colors, handleNavigate }: CradsProps) {
  const ref: React.Ref<LinearGradient> = useRef(null);

  return (
    <S.Container
      ref={ref}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      colors={colors}>
      {item.isDefault ? (
        <S.AddCardContainer>
          <S.EmptyCardTitle>{item.title}</S.EmptyCardTitle>
          <S.AddButton onPress={handleNavigate}>
            <Ionicon name="add-circle" size={RFPercentage(6)} color="#fff" />
          </S.AddButton>
        </S.AddCardContainer>
      ) : (
        <View>
          <S.IconContainer>
            <Icon />
          </S.IconContainer>
          <S.CardInfo onPress={handleNavigate}>
            <S.CardTitle> {item.title}</S.CardTitle>
            <S.CardBalance>{item.currentBalance}</S.CardBalance>
            <S.CardSubBalance>Previsto {item.estimateBalance}</S.CardSubBalance>
          </S.CardInfo>
        </View>
      )}
    </S.Container>
  );
}
