import React from 'react';
import { ModalBaseProps, Modal } from 'react-native';
import * as S from './styles';
import { Colors } from '../../../../styles/global';
import { Account } from '../../../../interfaces/Account';
import { useAccount } from '../../../../hooks/AccountContext';

interface IModalProps extends ModalBaseProps {
  title: string;
  defaulAccount?: string;
  accounts: Account[];
  handleConfirm?: () => Promise<void>;
  handleCancel?: () => void;
}

export default function ConfirmReceivedModalComponent({
  title,
  accounts,
  defaulAccount = '',
  handleCancel,
  handleConfirm,
  ...rest
}: IModalProps) {
  const { handleSelectAccount, accountSelected } = useAccount();

  const cancelColor = Colors.ERROR_LIGTHER;
  const unselectColor = Colors.BLUE_SOFT_LIGHTER;
  const selectColor = '#ABCBF1';
  const borderColor = Colors.BLUE_SECONDARY_LIGHTER;
  const primaryColor = Colors.BLUE_PRIMARY_LIGHTER;

  return (
    <S.Container visible={rest.visible || false}>
      <Modal {...rest}>
        <S.Wrapper>
          <S.Content>
            <S.Title>{title}</S.Title>

            {accounts.map(acc => (
              <S.AccountItem
                backgroundColor={
                  acc.id === defaulAccount || acc.id === accountSelected?.id
                    ? selectColor
                    : unselectColor
                }
                key={acc.id}
                selected={
                  acc.id === defaulAccount || acc.id === accountSelected?.id
                }
                borderColor={borderColor}
                onPress={() => handleSelectAccount(acc)}>
                <S.AccountName>{acc.name}</S.AccountName>
              </S.AccountItem>
            ))}

            <S.ConfirmationButtons>
              <S.Button backgroundColor="transparent" onPress={handleCancel}>
                <S.ButtonText size={2} color={cancelColor}>
                  Cancelar
                </S.ButtonText>
              </S.Button>

              <S.Button backgroundColor={primaryColor} onPress={handleConfirm}>
                <S.ButtonText size={2} color="#fff">
                  Receber
                </S.ButtonText>
              </S.Button>
            </S.ConfirmationButtons>
          </S.Content>
        </S.Wrapper>
      </Modal>
    </S.Container>
  );
}
