import React from 'react';
import { ModalBaseProps, Modal, ColorSchemeName } from 'react-native';
import * as S from './styles';
import { Colors } from '../../../../styles/global';
import { Account } from '../../../../interfaces/Account';
import { useAccount } from '../../../../hooks/AccountContext';

interface IModalProps extends ModalBaseProps {
  title: string;
  defaulAccount?: string;
  backgroundColor?: string;
  color?: string;
  theme?: ColorSchemeName;
  accounts: Account[];
  handleConfirm?: () => Promise<void>;
  handleCancel?: () => void;
}

export default function ConfirmReceivedModalComponent({
  title,
  accounts,
  defaulAccount = '',
  backgroundColor,
  color,
  theme,
  handleCancel,
  handleConfirm,
  ...rest
}: IModalProps) {
  const { handleSelectAccount, accountSelected } = useAccount();

  const cancelColor =
    theme === 'dark' ? Colors.ERROR_LIGTHER : Colors.ERROR_LIGTHER;
  const unselectColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const selectColor = theme === 'dark' ? '#2a333f' : '#ABCBF1';
  const borderColor =
    theme === 'dark'
      ? Colors.BLUE_SECONDARY_DARKER
      : Colors.BLUE_SECONDARY_LIGHTER;
  const primaryColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;

  return (
    <S.Container visible={rest.visible || false}>
      <Modal {...rest}>
        <S.Wrapper>
          <S.Content backgroundColor={backgroundColor}>
            <S.Title color={color}>{title}</S.Title>

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
                <S.AccountName color={color}>{acc.name}</S.AccountName>
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
