import React, { useCallback, useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
import { useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage } from 'react-native-responsive-fontsize';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';

import Menu from '../../components/Menu';
import Header from '../../components/Header';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import ModalComponent from '../../components/Modal';

import * as S from './styles';

import { Nav } from '../../routes';
import { currencyToValue } from '../../utils/masks';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { getAccountColors } from '../../utils/colors/account';
import { accountTypes } from '../../utils/accountTypes';
import {
  createAccount,
  deleteAccount,
  updateAccount,
} from '../../store/modules/Accounts/fetchActions';
import { useDispatch, useSelector } from 'react-redux';
import { ICreateAccount, IUpdateAccount } from '../../interfaces/Account';
import State from '../../interfaces/State';
import { removeMessage } from '../../store/modules/Feedbacks';
interface ProfileProps {
  route?: {
    key: string;
    name: string;
    params: {
      account?: any;
    };
    path: string | undefined;
  };
}

const schema = yup.object({
  name: yup
    .string()
    .required('Campo obrigátorio')
    .min(2, 'deve ter no mínimo 2 caracteres')
    .max(25, 'deve ter no máximo 25 caracteres'),
  type: yup.string().required('Campo obrigátorio'),
});

type FormData = {
  name: string;
  type: string | number;
  status: string;
  initialValue?: string;
};

export default function Account(props: ProfileProps) {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<any>();
  const { user } = useAuth();
  const { incomesOnAccount } = useSelector((state: State) => state.incomes);
  const { expansesOnAccount } = useSelector((state: State) => state.expanses);
  const { messages } = useSelector((state: State) => state.feedbacks);
  const { theme } = useTheme();
  const colors = getAccountColors(theme);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountState, setAccountState] = useState(
    props?.route?.params?.account,
  );
  const [showMessage, setShowMessage] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleOkSucess = () => {
    handleCloseModal();
    setTimeout(() => navigation.navigate('Home'), 300);
  };

  const canDelete = useCallback(() => {
    return (
      !incomesOnAccount.find(i => i.accountId === accountState.id) &&
      !expansesOnAccount.find(i => i.accountId === accountState.id)
    );
  }, [expansesOnAccount, incomesOnAccount, accountState]);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: accountState?.name || '',
      type: accountTypes.find(c => c.name === accountState?.type)
        ? accountTypes.find(c => c.name === accountState?.type)?.id
        : accountTypes[0].name,
      status: accountState?.status || 'active',
      initialValue: accountState?.initialValue
        ? getCurrencyFormat(accountState?.initialValue)
        : getCurrencyFormat(0),
    },
    resolver: yupResolver(schema),
  });

  const SaveIcon = () => {
    return (
      <FeatherIcons
        name="save"
        size={24}
        color={theme === 'dark' ? '#d8d8d8' : '#fff'}
      />
    );
  };

  const handleSubmitAccount = async (data: FormData) => {
    if (user) {
      if (accountState) {
        setLoadingMessage('Atualizando...');
        setIsSubmitting(true);
        const accountToUpdate: IUpdateAccount = {
          ...data,
          type:
            accountTypes.find(type => type.id === Number(data.type))?.name ||
            data.type,
          userId: user.id,
        };
        await dispatch(updateAccount(accountToUpdate, accountState.id));
      } else {
        setLoadingMessage('Criando...');
        setIsSubmitting(true);
        const accountToCreate: ICreateAccount = {
          ...data,
          type:
            accountTypes.find(type => type.id === Number(data.type))?.name ||
            data.type,
          initialValue: data.initialValue
            ? Number(currencyToValue(data.initialValue))
            : 0,
          userId: user.id,
        };
        dispatch(createAccount(accountToCreate));
      }
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (user && accountState) {
      setDeleteConfirmationVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);
      dispatch(deleteAccount(accountState.id, user.id));
      setIsSubmitting(false);
    }
  }, [user, accountState]);

  const handleCloseModal = () => {
    setShowMessage(false);
    dispatch(removeMessage());
  };

  useEffect(() => {
    if (messages) {
      setShowMessage(true);
    }
  }, [messages]);

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container>
        <KeyboardAwareScrollView
          resetScrollToCoords={{ x: 0, y: 0 }}
          scrollEnabled
          showsVerticalScrollIndicator={false}
          style={{ width: '100%' }}
          contentContainerStyle={{ alignItems: 'center' }}>
          <S.Title color={colors.titleColor}>
            {accountState ? `Editar Conta` : `Nova Conta`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={accountState?.name ? accountState.name : ''}
          />

          <ControlledInput
            label="Tipo de conta"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="type"
            control={control}
            value={accountState?.type ? accountState.type : ''}
            selectItems={accountTypes}
          />

          <S.Row>
            <S.Col>
              <ControlledInput
                label="Saldo Inicial"
                background={colors.inputBackground}
                textColor={colors.textColor}
                returnKeyType="next"
                keyboardType="number-pad"
                name="initialValue"
                control={control}
                currencyFormater
                disabled={!!accountState}
                value={
                  accountState?.initialValue
                    ? String(accountState.initialValue)
                    : '0'
                }
              />
            </S.Col>

            <S.SwitchContainer>
              <S.Label
                color={colors.textColor}
                style={{ width: '100%', textAlign: 'right' }}>
                Ativo
              </S.Label>
              <ControlledInput
                type="switch"
                background="transparent"
                textColor={colors.textColor}
                name="status"
                control={control}
                value={accountState?.status ? accountState.status : 'active'}
                thumbColor={colors.thumbColor}
                trackColor={colors.trackColor}
              />
            </S.SwitchContainer>
          </S.Row>

          <S.ButtonContainer>
            <Button
              title={accountState ? 'Salvar' : 'Criar'}
              colors={colors.saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitAccount)}
            />
            {accountState && canDelete() && (
              <S.DeleteButton
                onPress={() => setDeleteConfirmationVisible(true)}>
                <IonIcons
                  name="trash"
                  size={RFPercentage(4)}
                  color={colors.deleteButtonColor}
                />
              </S.DeleteButton>
            )}
          </S.ButtonContainer>
        </KeyboardAwareScrollView>

        <ModalComponent
          type="loading"
          visible={isSubmitting}
          transparent
          title={loadingMessage}
          animationType="slide"
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />
        <ModalComponent
          type={messages ? messages.type : 'error'}
          visible={showMessage}
          handleCancel={handleCloseModal}
          onRequestClose={handleCloseModal}
          transparent
          title={messages?.message}
          subtitle={
            messages?.type === 'error'
              ? 'Tente novamente mais tarde'
              : undefined
          }
          animationType="slide"
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
          onSucessOkButton={
            messages?.type === 'success' ? handleOkSucess : undefined
          }
        />

        <ModalComponent
          type="confirmation"
          visible={deleteConfirmationVisible}
          handleCancel={() => setDeleteConfirmationVisible(false)}
          onRequestClose={() => setDeleteConfirmationVisible(false)}
          transparent
          title="Deseja mesmo excluir essa conta?"
          animationType="slide"
          handleConfirm={handleDelete}
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />
      </S.Container>
      <Menu />
    </>
  );
}
