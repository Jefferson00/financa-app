import React from 'react';
import Icons from 'react-native-vector-icons/Ionicons';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as S from '../styles';
import { ModalColors } from '..';

interface ConfirmationProps {
  modalColors: ModalColors;
  confirmationText?: string;
  requestConfirm?: () => Promise<void>;
  onCancel?: () => void;
}

export function Confirmation({
  modalColors,
  confirmationText,
  onCancel,
  requestConfirm,
}: ConfirmationProps) {
  return (
    <>
      <Icons name="alert-circle" size={36} color={modalColors().error} />
      <S.Text
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}
        style={{ marginTop: RFPercentage(1) }}>
        {confirmationText}
      </S.Text>

      <S.Row>
        <S.Button
          backgroundColor={modalColors().secondary_button_bg}
          style={{
            marginRight: RFPercentage(2.4),
          }}
          onPress={onCancel}>
          <S.Text
            fontSize={2}
            fontWeight="SemiBold"
            color={modalColors().primary}>
            Cancelar
          </S.Text>
        </S.Button>

        <S.Button
          backgroundColor={modalColors().error}
          onPress={requestConfirm}>
          <S.Text
            fontSize={2}
            fontWeight="SemiBold"
            color={modalColors().primary_button_text}>
            Ok
          </S.Text>
        </S.Button>
      </S.Row>
    </>
  );
}
