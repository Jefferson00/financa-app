import React from 'react';
import { ModalBaseProps, Modal, ActivityIndicator } from 'react-native';
import * as S from './styles';
import Icons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/global';

interface IModalProps extends ModalBaseProps {
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.FC;
  type: 'success' | 'error' | 'info' | 'confirmation' | 'loading';
  handleConfirm?: () => Promise<void>;
  handleCancel?: () => void;
}

export default function ModalComponent({
  title,
  subtitle,
  icon: Icon,
  type,
  handleCancel,
  handleConfirm,
  ...rest
}: IModalProps) {
  const successColor = Colors.SUCCESS_LIGHTER;
  const loadingColor = Colors.LOADING_LIGTHER;
  const errorColor = Colors.ERROR_LIGTHER;
  const warningColor = Colors.WARNIGN_LIGTHER;

  const primaryColor = Colors.BLUE_PRIMARY_LIGHTER;

  return (
    <S.Container visible={rest.visible || false}>
      <Modal {...rest}>
        <S.Wrapper>
          <S.Content>
            {type === 'loading' && (
              <ActivityIndicator size="large" color={loadingColor} />
            )}
            {(type === 'error' || type === 'confirmation') && (
              <Icons name="alert-circle" size={36} color={errorColor} />
            )}
            {type === 'success' && (
              <Icons name="checkmark-circle" size={36} color={successColor} />
            )}

            {title && <S.Title>{title}</S.Title>}
            {subtitle && <S.Subtitle>{subtitle}</S.Subtitle>}

            {(type === 'error' || type === 'success') && handleCancel && (
              <S.OkButton>
                <S.ButtonText
                  color={primaryColor}
                  onPress={() => handleCancel()}>
                  OK
                </S.ButtonText>
              </S.OkButton>
            )}

            {type === 'confirmation' && (
              <S.ConfirmationButtons>
                <S.Button backgroundColor={primaryColor} onPress={handleCancel}>
                  <S.ButtonText size={2} color="#fff">
                    Cancelar
                  </S.ButtonText>
                </S.Button>

                <S.Button backgroundColor={errorColor} onPress={handleConfirm}>
                  <S.ButtonText size={2} color="#fff">
                    Sim
                  </S.ButtonText>
                </S.Button>
              </S.ConfirmationButtons>
            )}
          </S.Content>
        </S.Wrapper>
      </Modal>
    </S.Container>
  );
}
