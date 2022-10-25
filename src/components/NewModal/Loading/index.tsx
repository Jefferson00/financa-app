import React from 'react';
import * as S from '../styles';
import { ModalColors } from '..';
import { ActivityIndicator } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface LoadingProps {
  modalColors: ModalColors;
  loadingMessage?: string;
}

export function Loading({ modalColors, loadingMessage }: LoadingProps) {
  return (
    <>
      <ActivityIndicator size="large" color={modalColors().primary} />
      <S.Text
        style={{ marginTop: RFPercentage(1) }}
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}>
        {loadingMessage}
      </S.Text>
    </>
  );
}
