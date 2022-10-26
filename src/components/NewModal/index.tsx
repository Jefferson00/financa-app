import React, { useEffect, useMemo, useState } from 'react';
import {
  ModalBaseProps,
  TouchableWithoutFeedback,
  Modal as ReactNativeModal,
} from 'react-native';
import { colors } from '../../styles/colors';
import { useTheme } from '../../hooks/ThemeContext';
import * as S from './styles';
import { IAccount } from '../../interfaces/Account';
import State from '../../interfaces/State';
import { useDispatch, useSelector } from 'react-redux';
import { removeMessage } from '../../store/modules/Feedbacks';
import { Confirmation } from './Confirmation';
import { Success } from './Success';
import { Error } from './Error';
import { Colors } from './Colors';
import { AccountConfirmation } from './AccountConfirmation';
import { Loading } from './Loading';

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
  handleSelectColor?: (color: string) => void;
  requestConfirm?: () => Promise<void>;
  onCancel?: () => void;
  accounts?: IAccount[];
  defaulAccount?: string;
  texts?: {
    loadingText?: string;
    confirmationText?: string;
    successText?: string;
    errorText?: string;
  };
}

export type ModalColors = () => {
  primary: string;
  main_text: string;
  primary_button_text: string;
  secondary_button_bg: string;
  success: string;
  error: string;
  select: string;
  unselect: string;
};

export function Modal({
  visible,
  texts,
  type,
  accounts,
  defaulAccount = '',
  defaultConfirm,
  requestConfirm,
  onCancel,
  handleSelectColor,
  ...rest
}: IModalProps) {
  const dispatch = useDispatch<any>();
  const { theme } = useTheme();
  const { loading: loadingIncomes } = useSelector(
    (state: State) => state.incomes,
  );
  const { loading: loadingExpanses } = useSelector(
    (state: State) => state.expanses,
  );
  const { loading: loadingAccounts } = useSelector(
    (state: State) => state.accounts,
  );
  const { loading: loadingCreditCards } = useSelector(
    (state: State) => state.creditCards,
  );
  const { messages } = useSelector((state: State) => state.feedbacks);
  const [status, setStatus] = useState(type);

  const onConfirmRequest = async () => {
    if (requestConfirm) {
      requestConfirm();
    }
  };

  const loading = useMemo(
    () =>
      loadingExpanses ||
      loadingIncomes ||
      loadingCreditCards ||
      loadingAccounts,
    [loadingExpanses, loadingIncomes, loadingCreditCards, loadingAccounts],
  );

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
    if (loading) {
      setStatus('Loading');
    } else if (messages) {
      if (messages?.type === 'success') {
        setStatus('Success');
      } else {
        setStatus('Error');
      }
    }
  }, [loading, messages]);

  useEffect(() => {
    setStatus(type);
  }, [type, visible]);

  const modalColors = () => {
    if (theme === 'dark') {
      return {
        primary: colors.blue[100],
        main_text: colors.blue[200],
        primary_button_text: colors.blue[200],
        secondary_button_bg: colors.dark[700],
        success: colors.green.dark[500],
        error: colors.red.dark[500],
        select: colors.dark[700],
        unselect: colors.gray[300],
        content_bg: colors.dark[800],
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
      content_bg: colors.white,
    };
  };

  return (
    <ReactNativeModal
      statusBarTranslucent
      visible={visible}
      {...rest}
      onRequestClose={onClose}>
      <S.Wrapper onPress={onClose}>
        <TouchableWithoutFeedback>
          <S.Content backgroundColor={modalColors().content_bg}>
            {status === 'Confirmation' && (
              <Confirmation
                modalColors={modalColors}
                confirmationText={texts?.confirmationText}
                onCancel={onClose}
                requestConfirm={onConfirmRequest}
              />
            )}

            {status === 'Loading' && (
              <Loading
                modalColors={modalColors}
                loadingMessage={texts?.loadingText}
              />
            )}

            {status === 'Success' && (
              <Success
                modalColors={modalColors}
                onOk={onOk}
                sucessMessage={messages?.message}
              />
            )}

            {status === 'Error' && (
              <Error
                modalColors={modalColors}
                onOk={onOk}
                errorMessage={messages?.message}
              />
            )}

            {status === 'Colors' && handleSelectColor && (
              <Colors
                handleSelectColor={handleSelectColor}
                modalColors={modalColors}
              />
            )}

            {status === 'AccountConfirmation' && (
              <AccountConfirmation
                confirmationText={texts?.confirmationText}
                accounts={accounts}
                modalColors={modalColors}
                defaulAccount={defaulAccount}
                onCancel={onClose}
                requestConfirm={onConfirmRequest}
              />
            )}
          </S.Content>
        </TouchableWithoutFeedback>
      </S.Wrapper>
    </ReactNativeModal>
  );
}
