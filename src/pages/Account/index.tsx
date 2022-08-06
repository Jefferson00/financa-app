import React, { useCallback, useState } from 'react';
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
import { useAccount } from '../../hooks/AccountContext';

import Menu from '../../components/Menu';
import Header from '../../components/Header';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import ModalComponent from '../../components/Modal';

import * as S from './styles';

import api from '../../services/api';
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
import { useDispatch } from 'react-redux';
import { ICreateAccount, IUpdateAccount } from '../../interfaces/Account';
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
  const { getActiveUserAccounts, incomesOnAccounts, expansesOnAccounts } =
    useAccount();
  const { theme } = useTheme();
  const colors = getAccountColors(theme);

  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountState, setAccountState] = useState(
    props?.route?.params?.account,
  );
  const [hasError, setHasError] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );
  const [loadingMessage, setLoadingMessage] = useState('');
  const [sucessMessage, setSucessMessage] = useState('');

  const handleOkSucess = () => {
    setEditSucessfully(false);
    setTimeout(() => navigation.navigate('Home'), 300);
  };

  const canDelete = useCallback(() => {
    return (
      !incomesOnAccounts.find(i => i.accountId === accountState.id) &&
      !expansesOnAccounts.find(i => i.accountId === accountState.id)
    );
  }, [expansesOnAccounts, incomesOnAccounts, accountState]);

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
      try {
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
          setSucessMessage('Conta atualizada com sucesso!');
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
          setSucessMessage('Conta criada com sucesso!');
        }

        await getActiveUserAccounts();
        setEditSucessfully(true);
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleDelete = useCallback(async () => {
    if (user && accountState) {
      setDeleteConfirmationVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);
      try {
        await dispatch(deleteAccount(accountState.id, user.id));
        setSucessMessage('Conta excluída com sucesso!');
        setEditSucessfully(true);
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [user, accountState]);

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
          type="error"
          visible={hasError}
          handleCancel={() => setHasError(false)}
          onRequestClose={() => setHasError(false)}
          transparent
          title={errorMessage}
          subtitle="Tente novamente mais tarde"
          animationType="slide"
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />
        <ModalComponent
          type="success"
          visible={editSucessfully}
          transparent
          title={sucessMessage}
          animationType="slide"
          handleCancel={() => setEditSucessfully(false)}
          onSucessOkButton={handleOkSucess}
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
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
