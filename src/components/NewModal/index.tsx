import React, { useEffect, useState } from 'react';
import {
  ModalBaseProps,
  TouchableWithoutFeedback,
  Modal as ReactNativeModal,
  ActivityIndicator,
} from 'react-native';
import { colors } from '../../styles/colors';
import { useTheme } from '../../hooks/ThemeContext';
import Icons from 'react-native-vector-icons/Ionicons';
import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { IAccount } from '../../interfaces/Account';
import { useAccount } from '../../hooks/AccountContext';
import State from '../../interfaces/State';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../store/modules/Feedbacks';

interface IModalProps extends ModalBaseProps {
  type:
    | 'Confirmation'
    | 'Default'
    | 'Colors'
    | 'AccountConfirmation'
    | 'Loading'
    | 'Success'
    | 'Error';
  defaultConfirm?: () => void;
  requestConfirm?: () => Promise<void>;
  onCancel?: () => void;
  accounts?: IAccount[];
  defaulAccount?: string;
  texts: {
    loadingText?: string;
    confirmationText?: string;
    successText?: string;
    errorText?: string;
  };
}

export function Modal({
  visible,
  texts,
  type,
  accounts,
  defaulAccount = '',
  defaultConfirm,
  requestConfirm,
  onCancel,
  ...rest
}: IModalProps) {
  const dispatch = useDispatch<any>();
  const { theme } = useTheme();
  const { handleSelectAccount, accountSelected } = useAccount();
  const { loading: loadingIncomes } = useSelector(
    (state: State) => state.incomes,
  );
  const { loading: loadingExpanses } = useSelector(
    (state: State) => state.expanses,
  );
  const { messages } = useSelector((state: State) => state.feedbacks);
  const [status, setStatus] = useState(type);

  const onConfirmRequest = async () => {
    if (requestConfirm) {
      requestConfirm();
    }
  };

  const onClose = () => {
    setStatus(type);
    dispatch(removeMessage());
    onCancel && onCancel();
  };

  const onOk = () => {
    dispatch(removeMessage());
    defaultConfirm && defaultConfirm();
  };

  useEffect(() => {
    if (loadingExpanses || loadingIncomes) {
      setStatus('Loading');
    } else if (messages) {
      if (messages?.type === 'success') {
        setStatus('Success');
      } else {
        setStatus('Error');
      }
    }
  }, [loadingIncomes, loadingExpanses, messages]);

  useEffect(() => {
    setStatus(type);
  }, [type, visible]);

  const modalColors = () => {
    if (theme === 'dark') {
      return {
        primary: colors.blue[500],
        main_text: colors.blue[200],
        primary_button_text: colors.blue[200],
        secondary_button_bg: colors.blue[200],
        success: colors.green.dark[500],
        error: colors.red.dark[500],
        select: colors.dark[700],
        unselect: colors.blue[100],
      };
    }
    return {
      primary: colors.blue[500],
      main_text: colors.gray[900],
      primary_button_text: colors.white,
      secondary_button_bg: colors.blue[200],
      success: colors.green[500],
      error: colors.red[500],
      select: colors.blue[300],
      unselect: colors.blue[100],
    };
  };

  return (
    <S.Container visible={visible || false}>
      <ReactNativeModal
        statusBarTranslucent
        visible={visible}
        {...rest}
        onRequestClose={onClose}>
        <S.Wrapper onPress={onClose}>
          <TouchableWithoutFeedback>
            <S.Content>
              {status === 'Confirmation' && (
                <>
                  <Icons
                    name="alert-circle"
                    size={36}
                    color={modalColors().error}
                  />
                  <S.Text
                    fontSize={2}
                    fontWeight="SemiBold"
                    color={modalColors().main_text}>
                    {texts?.confirmationText}
                  </S.Text>

                  <S.Row>
                    <S.Button
                      backgroundColor={modalColors().secondary_button_bg}
                      style={{
                        marginRight: RFPercentage(2.4),
                      }}
                      onPress={onClose}>
                      <S.Text
                        fontSize={2}
                        fontWeight="SemiBold"
                        color={modalColors().primary}>
                        Cancelar
                      </S.Text>
                    </S.Button>

                    <S.Button
                      backgroundColor={modalColors().error}
                      onPress={onConfirmRequest}>
                      <S.Text
                        fontSize={2}
                        fontWeight="SemiBold"
                        color={modalColors().primary_button_text}>
                        Ok
                      </S.Text>
                    </S.Button>
                  </S.Row>
                </>
              )}

              {status === 'Loading' && (
                <>
                  <ActivityIndicator
                    size="large"
                    color={modalColors().primary}
                  />
                  <S.Text
                    fontSize={2}
                    fontWeight="SemiBold"
                    color={modalColors().main_text}>
                    {texts?.loadingText}
                  </S.Text>
                </>
              )}

              {status === 'Success' && (
                <>
                  <Icons
                    name="checkmark-circle"
                    size={36}
                    color={modalColors().success}
                  />
                  <S.Text
                    fontSize={2}
                    fontWeight="SemiBold"
                    color={modalColors().main_text}>
                    {messages?.message}
                  </S.Text>

                  <S.Button
                    backgroundColor={modalColors().primary}
                    onPress={onOk}>
                    <S.Text
                      fontSize={2}
                      fontWeight="SemiBold"
                      color={modalColors().primary_button_text}>
                      Ok
                    </S.Text>
                  </S.Button>
                </>
              )}

              {status === 'Error' && (
                <>
                  <Icons
                    name="alert-circle"
                    size={36}
                    color={modalColors().error}
                  />
                  <S.Text
                    fontSize={2}
                    fontWeight="SemiBold"
                    color={modalColors().main_text}>
                    {messages?.message}
                  </S.Text>

                  <S.Button
                    backgroundColor={modalColors().primary}
                    onPress={onOk}>
                    <S.Text
                      fontSize={2}
                      fontWeight="SemiBold"
                      color={modalColors().primary_button_text}>
                      Ok
                    </S.Text>
                  </S.Button>
                </>
              )}

              {status === 'AccountConfirmation' && (
                <>
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

                  <S.Row>
                    <S.Button
                      backgroundColor={modalColors().secondary_button_bg}
                      style={{
                        marginRight: RFPercentage(2.4),
                      }}
                      onPress={onClose}>
                      <S.Text
                        fontSize={2}
                        fontWeight="SemiBold"
                        color={modalColors().primary}>
                        Cancelar
                      </S.Text>
                    </S.Button>

                    <S.Button
                      backgroundColor={modalColors().error}
                      onPress={onConfirmRequest}>
                      <S.Text
                        fontSize={2}
                        fontWeight="SemiBold"
                        color={modalColors().primary_button_text}>
                        Ok
                      </S.Text>
                    </S.Button>
                  </S.Row>
                </>
              )}
            </S.Content>
          </TouchableWithoutFeedback>
        </S.Wrapper>
      </ReactNativeModal>
    </S.Container>
  );
}
