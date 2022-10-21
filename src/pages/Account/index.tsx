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

import Menu from '../../components/Menu';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';

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
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { Modal } from '../../components/NewModal';
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
  const { creditCards } = useSelector((state: State) => state.creditCards);
  const { theme } = useTheme();
  const colors = getAccountColors(theme);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [accountState] = useState(props?.route?.params?.account);

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setTimeout(() => navigation.navigate('Home'), 200);
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => navigation.navigate('Home'), 200);
  };

  const canDelete = useCallback(() => {
    return (
      !incomesOnAccount.find(i => i.accountId === accountState.id) &&
      !expansesOnAccount.find(i => i.accountId === accountState.id) &&
      !creditCards.find(c => c.receiptDefault === accountState.id)
    );
  }, [expansesOnAccount, incomesOnAccount, accountState, creditCards]);

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
      setIsModalVisible(true);
      if (accountState) {
        const accountToUpdate: IUpdateAccount = {
          ...data,
          type:
            accountTypes.find(type => type.id === Number(data.type))?.name ||
            data.type,
          userId: user.id,
        };
        await dispatch(updateAccount(accountToUpdate, accountState.id));
      } else {
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
    }
  };

  const handleDelete = useCallback(async () => {
    if (user && accountState) {
      dispatch(deleteAccount(accountState.id, user.id));
    }
  }, [user, accountState]);

  return (
    <>
      <ReducedHeader title={accountState ? `Editar Conta` : `Nova Conta`} />

      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
        }}>
        <S.Container>
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
          </S.Row>

          <S.ButtonContainer>
            <Button
              title={accountState ? 'Salvar' : 'Criar'}
              colors={colors.saveButtonColors}
              icon={SaveIcon}
              onPress={handleSubmit(handleSubmitAccount)}
            />
            {accountState && canDelete() && (
              <S.DeleteButton onPress={() => setIsDeleteModalVisible(true)}>
                <IonIcons
                  name="trash"
                  size={RFPercentage(4)}
                  color={colors.deleteButtonColor}
                />
              </S.DeleteButton>
            )}
          </S.ButtonContainer>
        </S.Container>
      </KeyboardAwareScrollView>

      <Modal
        transparent
        animationType="slide"
        texts={{
          loadingText: accountState ? 'Atualizando...' : 'Criando...',
        }}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        defaultConfirm={handleCloseModal}
        type="Loading"
      />

      <Modal
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Tem certeza que deseja excluir essa conta?',
          loadingText: 'Excluindo conta...',
        }}
        requestConfirm={handleDelete}
        defaultConfirm={closeDeleteModal}
        onCancel={closeDeleteModal}
        visible={isDeleteModalVisible}
        type="Confirmation"
      />

      <Menu />
    </>
  );
}
