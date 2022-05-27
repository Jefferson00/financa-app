import React from 'react';
import {
  ModalBaseProps,
  Modal,
  ActivityIndicator,
  TouchableWithoutFeedback,
  ColorSchemeName,
} from 'react-native';
import * as S from './styles';
import Icons from 'react-native-vector-icons/Ionicons';
import { Colors } from '../../styles/global';

interface IModalProps extends ModalBaseProps {
  isLoading?: boolean;
  title?: string;
  subtitle?: string;
  icon?: React.FC;
  type: 'success' | 'error' | 'info' | 'confirmation' | 'loading' | 'select';
  selectTitle?: string;
  selectList?: any[];
  backgroundColor?: string;
  color?: string;
  theme?: ColorSchemeName;
  renderItem?: (item: any) => Element;
  handleConfirm?: () => Promise<void>;
  handleCancel?: () => void;
  onSucessOkButton?: () => void;
}

export default function ModalComponent({
  title,
  subtitle,
  icon: Icon,
  type,
  selectTitle,
  selectList,
  backgroundColor,
  color,
  theme,
  renderItem,
  handleCancel,
  handleConfirm,
  onSucessOkButton,
  ...rest
}: IModalProps) {
  const successColor =
    theme === 'dark' ? Colors.SUCCESS_DARKER : Colors.SUCCESS_LIGHTER;
  const loadingColor =
    theme === 'dark' ? Colors.LOADING_DARKER : Colors.LOADING_LIGTHER;
  const errorColor =
    theme === 'dark' ? Colors.ERROR_DARKER : Colors.ERROR_LIGTHER;
  const warningColor =
    theme === 'dark' ? Colors.WARNIGN_DARKER : Colors.WARNIGN_LIGTHER;

  const primaryColor = Colors.BLUE_PRIMARY_LIGHTER;

  return (
    <S.Container visible={rest.visible || false}>
      <Modal {...rest}>
        <S.Wrapper onPress={handleCancel}>
          <TouchableWithoutFeedback>
            <S.Content backgroundColor={backgroundColor || '#fff'}>
              {type === 'loading' && (
                <ActivityIndicator size="large" color={loadingColor} />
              )}
              {(type === 'error' || type === 'confirmation') && (
                <Icons name="alert-circle" size={36} color={errorColor} />
              )}
              {type === 'info' && (
                <Icons name="alert-circle" size={36} color={warningColor} />
              )}
              {type === 'success' && (
                <Icons name="checkmark-circle" size={36} color={successColor} />
              )}

              {title && <S.Title color={color}>{title}</S.Title>}
              {subtitle && <S.Subtitle color={color}>{subtitle}</S.Subtitle>}

              {type === 'error' && handleCancel && (
                <S.OkButton>
                  <S.ButtonText
                    color={primaryColor}
                    onPress={() => handleCancel()}>
                    OK
                  </S.ButtonText>
                </S.OkButton>
              )}

              {type === 'success' && onSucessOkButton && (
                <S.OkButton>
                  <S.ButtonText
                    color={primaryColor}
                    onPress={() => onSucessOkButton()}>
                    OK
                  </S.ButtonText>
                </S.OkButton>
              )}

              {type === 'info' && onSucessOkButton && (
                <S.OkButton>
                  <S.ButtonText
                    color={primaryColor}
                    onPress={() => onSucessOkButton()}>
                    OK
                  </S.ButtonText>
                </S.OkButton>
              )}

              {type === 'confirmation' && (
                <S.ConfirmationButtons>
                  <S.Button
                    backgroundColor={primaryColor}
                    onPress={handleCancel}>
                    <S.ButtonText size={2} color="#fff">
                      Cancelar
                    </S.ButtonText>
                  </S.Button>

                  <S.Button
                    backgroundColor={errorColor}
                    onPress={handleConfirm}>
                    <S.ButtonText size={2} color="#fff">
                      Sim
                    </S.ButtonText>
                  </S.Button>
                </S.ConfirmationButtons>
              )}

              {type === 'select' && (
                <>
                  <S.SelectTitle color={color}>{selectTitle}</S.SelectTitle>
                  <S.SelectContent>
                    {selectList &&
                      selectList.map((item, index) => (
                        <S.SelectItem key={item.id || index}>
                          {renderItem && renderItem(item)}
                        </S.SelectItem>
                      ))}
                  </S.SelectContent>
                </>
              )}
            </S.Content>
          </TouchableWithoutFeedback>
        </S.Wrapper>
      </Modal>
    </S.Container>
  );
}
