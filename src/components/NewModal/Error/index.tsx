import React from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as S from '../styles';
import { ModalColors } from '..';

interface ErrorProps {
  modalColors: ModalColors;
  errorMessage?: string;
  onOk?: () => void;
}

export function Error({ modalColors, onOk, errorMessage }: ErrorProps) {
  return (
    <>
      <Icons name="alert-circle" size={36} color={modalColors().error} />
      <S.Text
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}
        style={{ marginTop: RFPercentage(1), marginBottom: RFPercentage(4.4) }}>
        {errorMessage}
      </S.Text>

      <S.Button backgroundColor={modalColors().primary} onPress={onOk}>
        <S.Text
          fontSize={2}
          fontWeight="SemiBold"
          color={modalColors().primary_button_text}>
          Ok
        </S.Text>
      </S.Button>
    </>
  );
}
