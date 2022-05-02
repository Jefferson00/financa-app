import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../hooks/AuthContext';
import Menu from '../../components/Menu';
import { Colors } from '../../styles/global';
import * as S from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import { currencyToValue, phoneMask, priceMask } from '../../utils/masks';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../../services/api';
import ModalComponent from '../../components/Modal';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Nav } from '../../routes';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAccount } from '../../hooks/AccountContext';
import { Account as IAccount } from '../../interfaces/Account';

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

export default function Account(props: ProfileProps) {
  const navigation = useNavigation<Nav>();
  const { user, updateUser } = useAuth();
  const { getUserAccounts } = useAccount();
  const { theme } = useTheme();
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
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: accountState?.name || '',
      type: accountState?.type || 'Conta Corrente',
      status: accountState?.status || 'active',
      initialValue: accountState?.initialValue
        ? getCurrencyFormat(accountState?.initialValue)
        : getCurrencyFormat(0),
    },
    resolver: yupResolver(schema),
  });

  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const deleteButtonColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;

  const SaveIcon = () => {
    return (
      <Icons
        name="save"
        size={24}
        color={theme === 'dark' ? '#d8d8d8' : '#fff'}
      />
    );
  };

  const accountTypes = [
    {
      id: 1,
      name: 'Conta Corrente',
    },
    {
      id: 2,
      name: 'Conta Poupança',
    },
    {
      id: 3,
      name: 'Carteira',
    },
    {
      id: 4,
      name: 'Outro',
    },
  ];

  type FormData = {
    name: string;
    type: string;
    status: string;
    initialValue?: string;
  };

  const saveButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.ORANGE_PRIMARY_DARKER
        : Colors.ORANGE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.ORANGE_SECONDARY_DARKER
        : Colors.ORANGE_SECONDARY_LIGHTER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  const handleSubmitAccount = async (data: FormData) => {
    setIsSubmitting(true);
    const accountInput = {
      userId: user?.id,
      status: data.status,
      name: data.name,
      type: data.type,
    };
    try {
      if (accountState) {
        await api.put(`accounts/${accountState.id}`, accountInput);
      } else {
        await api.post(`accounts`, {
          ...accountInput,
          initialValue: data.initialValue
            ? Number(currencyToValue(data.initialValue))
            : 0,
        });
      }

      await getUserAccounts();
      setEditSucessfully(true);
    } catch (error: any) {
      if (error?.response?.data?.message)
        setErrorMessage(error?.response?.data?.message);
      console.log(error?.response?.data);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = useCallback(async () => {
    if (user && accountState) {
      setIsSubmitting(true);
      try {
        await api.delete(`accounts/${accountState.id}/${user.id}`);
        await getUserAccounts();
        navigation.navigate('Home');
      } catch (error) {
        console.log(error);
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
          <S.Title color={titleColor}>
            {accountState ? `Editar Conta` : `Nova Conta`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={inputBackground}
            textColor={textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={accountState?.name ? accountState.name : ''}
          />

          <ControlledInput
            label="Tipo de conta"
            type="select"
            background={inputBackground}
            textColor={textColor}
            name="type"
            control={control}
            value={accountState?.type ? accountState.type : ''}
            selectItems={accountTypes}
          />

          <S.Row>
            <S.Col>
              <ControlledInput
                label="Saldo Inicial"
                background={inputBackground}
                textColor={textColor}
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
                color={textColor}
                style={{ width: '100%', textAlign: 'right' }}>
                Ativo
              </S.Label>
              <ControlledInput
                type="switch"
                background="transparent"
                textColor={textColor}
                name="status"
                control={control}
                value={accountState?.status ? accountState.status : 'active'}
              />
            </S.SwitchContainer>
          </S.Row>

          <S.ButtonContainer>
            <Button
              title={accountState ? 'Salvar' : 'Criar'}
              colors={saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitAccount)}
            />
            {accountState && (
              <S.DeleteButton
                onPress={() => setDeleteConfirmationVisible(true)}>
                <Icon
                  name="trash"
                  size={RFPercentage(4)}
                  color={deleteButtonColor}
                />
              </S.DeleteButton>
            )}
          </S.ButtonContainer>
        </KeyboardAwareScrollView>
        <ModalComponent
          type="loading"
          visible={isSubmitting}
          transparent
          title={accountState ? 'Atualizando...' : 'Criando...'}
          animationType="slide"
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
        />
        <ModalComponent
          type="success"
          visible={editSucessfully}
          transparent
          title={
            accountState
              ? 'Conta atualizada com sucesso!'
              : 'Conta criada com sucesso!'
          }
          animationType="slide"
          handleCancel={() => setEditSucessfully(false)}
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
        />
      </S.Container>
      <Menu />
    </>
  );
}
