import React from 'react';
import * as S from '../styles';
import { ModalColors } from '..';
import { IAccount } from '../../../interfaces/Account';
import { useAccount } from '../../../hooks/AccountContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ScrollView } from 'react-native';

interface AccountConfirmationProps {
  modalColors: ModalColors;
  accounts?: IAccount[];
  defaulAccount?: string;
  confirmationText?: string;
  requestConfirm?: () => Promise<void>;
  onCancel?: () => void;
}

export function AccountConfirmation({
  modalColors,
  accounts,
  defaulAccount,
  requestConfirm,
  onCancel,
  confirmationText,
}: AccountConfirmationProps) {
  const { handleSelectAccount, accountSelected } = useAccount();

  return (
    <>
      <S.Text
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}
        style={{ marginBottom: RFPercentage(3.2) }}>
        {confirmationText}
      </S.Text>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: '100%', maxHeight: RFPercentage(40) }}
        contentContainerStyle={{ width: '100%' }}>
        {accounts?.map(acc => (
          <S.AccountItem
            backgroundColor={
              accountSelected
                ? acc.id === accountSelected?.id
                  ? modalColors().select
                  : modalColors().unselect
                : acc.id === defaulAccount
                ? modalColors().select
                : modalColors().unselect
            }
            key={acc.id}
            selected={
              accountSelected
                ? acc.id === accountSelected?.id
                : acc.id === defaulAccount
            }
            borderColor={modalColors().select}
            onPress={() => handleSelectAccount(acc)}>
            <S.Text
              color={modalColors().main_text}
              fontWeight="Regular"
              fontSize={2}>
              {acc.name}
            </S.Text>
          </S.AccountItem>
        ))}
      </ScrollView>

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
