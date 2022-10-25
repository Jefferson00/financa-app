import React from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as S from '../styles';
import { ModalColors } from '..';

interface SucessProps {
  modalColors: ModalColors;
  sucessMessage?: string;
  onOk?: () => void;
}

export function Success({ modalColors, onOk, sucessMessage }: SucessProps) {
  return (
    <>
      <Icons name="checkmark-circle" size={36} color={modalColors().success} />
      <S.Text
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}
        style={{ marginTop: RFPercentage(1), marginBottom: RFPercentage(4.4) }}>
        {sucessMessage}
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
