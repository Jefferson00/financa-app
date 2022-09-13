import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import FeatherIcon from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { RFPercentage } from 'react-native-responsive-fontsize';
import {
  addMonths,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/AuthContext';
import { useTheme } from '../../../hooks/ThemeContext';
import { useDate } from '../../../hooks/DateContext';

import Menu from '../../../components/Menu';
import ControlledInput from '../../../components/ControlledInput';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import ModalComponent from '../../../components/Modal';
import Input from '../../../components/Input';

import * as S from './styles';
import { Nav } from '../../../routes';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { currencyToValue } from '../../../utils/masks';
import { ExpanseCategories } from '../../../utils/categories';
import { getCreateExpansesColors } from '../../../utils/colors/expanses';
import { Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../interfaces/State';
import {
  createExpanse,
  createExpanseOnAccount,
  updateExpanse,
} from '../../../store/modules/Expanses/fetchActions';
import { ICreateExpanseOnAccount } from '../../../interfaces/ExpanseOnAccount';
import { removeMessage } from '../../../store/modules/Feedbacks';
import { useNotification } from '../../../hooks/NotificationContext';
import AsyncStorage from '@react-native-community/async-storage';
import { addCreatedExpanse } from '../../../store/modules/Expanses';

interface ExpanseProps {
  route?: {
    key: string;
    name: string;
    params: {
      expanse?: any;
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
});

export default function CreateExpanse(props: ExpanseProps) {
  const dispatch = useDispatch<any>();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { creditCards } = useSelector((state: State) => state.creditCards);
  const { expanseCreated, loading } = useSelector(
    (state: State) => state.expanses,
  );
  const { messages } = useSelector((state: State) => state.feedbacks);
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { onCreateTriggerNotification, getTriggerNotification } =
    useNotification();

  const { selectedDate } = useDate();
  const { theme } = useTheme();

  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanseState, setExpanseState] = useState(
    props?.route?.params?.expanse,
  );

  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [paid, setPaid] = useState(false);
  const [iteration, setIteration] = useState(1);
  const [startDate, setStartDate] = useState(selectedDate);
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);

  const colors = getCreateExpansesColors(theme);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: expanseState?.name || '',
      value: expanseState?.value
        ? getCurrencyFormat(expanseState?.value)
        : getCurrencyFormat(0),
      status: false,
      receiptDefault: expanseState?.receiptDefault || accounts[0].id,
      category: ExpanseCategories.find(c => c.name === expanseState?.category)
        ? ExpanseCategories.find(c => c.name === expanseState?.category)?.id
        : ExpanseCategories[0].name,
    },
    resolver: yupResolver(schema),
  });

  const SaveIcon = () => {
    return (
      <FeatherIcon
        name="save"
        size={24}
        color={theme === 'dark' ? '#d8d8d8' : '#fff'}
      />
    );
  };

  type FormData = {
    name: string;
    value: string;
    status: boolean;
    receiptDefault: string;
    category: string | number;
  };

  const handleOkSucess = () => {
    handleCloseModal();
    setTimeout(() => navigation.navigate('Expanses'), 300);
  };

  const handleCloseModal = () => {
    setShowMessage(false);
    dispatch(removeMessage());
  };

  const createExpanseNotification = async (
    expanseId: string,
    expanseName: string,
    startDate: any,
    endDate: any,
  ) => {
    const date = new Date(startDate);

    await AsyncStorage.setItem(
      `@FinancaAppBeta:expanseEndDate:${expanseId}`,
      String(endDate),
    );
    /*    await AsyncStorage.setItem(
      `@FinancaAppBeta:expanseName:${expanseId}`,
      String(expanseName),
    ); */

    const data = {
      expanseId,
    };

    onCreateTriggerNotification(
      'Lembrete de despesa',
      `A despesa ${expanseName} está próxima do vencimento, não se esqueça de pagar`,
      date,
      data,
    );
  };

  const updateExpanseNotification = async (
    expanseId: string,
    expanseName: string,
    startDate: any,
    endDate: any,
  ) => {
    const date = new Date(startDate);

    await AsyncStorage.setItem(
      `@FinancaAppBeta:expanseEndDate:${expanseId}`,
      String(endDate),
    );

    const data = {
      expanseId,
    };

    const notification = await getTriggerNotification(expanseId);

    if (notification) {
      onCreateTriggerNotification(
        'Lembrete de despesa',
        `A despesa ${expanseName} está próxima do vencimento, não se esqueça de pagar`,
        date,
        data,
        notification.notification.id,
      );
    }
  };

  const handleSubmitExpanse = async (data: FormData) => {
    if (user) {
      setIsSubmitting(true);
      const interationVerified = iteration === 0 ? 1 : iteration;
      const expanseInput = {
        name: data.name,
        userId: user.id,
        value: Number(currencyToValue(data.value)),
        category:
          ExpanseCategories.find(exp => exp.id === Number(data.category))
            ?.name || String(data.category),
        iteration:
          recurrence === 'Parcelada' ? String(interationVerified) : 'Mensal',
        receiptDate: startDate,
        startDate,
        endDate:
          recurrence === 'Parcelada'
            ? addMonths(startDate, interationVerified - 1)
            : null,
        receiptDefault: data.receiptDefault,
      };

      if (expanseState) {
        dispatch(updateExpanse(expanseInput, expanseState.id, false));
        await updateExpanseNotification(
          expanseState.id,
          expanseInput.name,
          expanseInput.startDate,
          expanseInput.endDate,
        );
      } else {
        dispatch(createExpanse(expanseInput, paid, false));
      }
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (expanseState?.iteration !== 'Mensal') {
      setIteration(expanseState?.iteration || 1);
    } else {
      setRecurrence('Mensal');
    }
  }, [expanseState]);

  useEffect(() => {
    if (user && paid && expanseCreated) {
      const findAccount = accounts.find(
        acc => acc.id === expanseCreated.receiptDefault,
      );

      const expanseOnAccountToCreate: ICreateExpanseOnAccount = {
        userId: user.id,
        accountId: expanseCreated.receiptDefault,
        expanseId: expanseCreated.id,
        month: new Date(),
        value: expanseCreated.value,
        name: expanseCreated.name,
        recurrence: expanseCreated.iteration,
      };

      if (findAccount) {
        dispatch(createExpanseOnAccount(expanseOnAccountToCreate, findAccount));
        setPaid(false);
      }
    }
  }, [expanseCreated, accounts, paid, user, dispatch]);

  useEffect(() => {
    if (expanseCreated) {
      createExpanseNotification(
        expanseCreated.id,
        expanseCreated.name,
        expanseCreated.startDate,
        expanseCreated.endDate,
      );
      dispatch(addCreatedExpanse(null));
    }
  }, [expanseCreated]);

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
          contentContainerStyle={{
            alignItems: 'center',
            paddingBottom: RFPercentage(15),
          }}>
          <S.Title color={colors.titleColor}>
            {expanseState ? `Editar Despesa` : `Nova Despesa`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={expanseState?.name ? expanseState.name : ''}
            defaultValue={expanseState?.name ? expanseState.name : ''}
          />

          <ControlledInput
            label="Valor"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            keyboardType="number-pad"
            name="value"
            control={control}
            currencyFormater
            value={expanseState?.value ? String(expanseState.value) : '0'}
          />

          <S.Label color={colors.textColor}>Recorrência</S.Label>
          <S.Row>
            <S.SelectOption
              backgroundColor={colors.inputBackground}
              onPress={() => setRecurrence('Mensal')}
              color={colors.textColor}
              checked={recurrence === 'Mensal'}>
              <S.Option color={colors.textColor}>Mensal</S.Option>
              <Ionicons
                name="checkmark"
                size={RFPercentage(4)}
                color={colors.textColor}
              />
            </S.SelectOption>

            <S.SelectOption
              backgroundColor={colors.inputBackground}
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              color={colors.textColor}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option color={colors.textColor}>Parcelada</S.Option>
              <Ionicons
                name="checkmark"
                size={RFPercentage(4)}
                color={colors.textColor}
              />
            </S.SelectOption>

            <Input
              background={colors.inputBackground}
              textColor={colors.textColor}
              value={
                iteration < 0 || isNaN(iteration) ? '1' : String(iteration)
              }
              keyboardType="number-pad"
              maxLength={2}
              onChangeText={value => setIteration(Number(value))}
              disabled={recurrence === 'Mensal'}
              prefix="x"
              width={RFPercentage(7)}
            />
          </S.Row>

          <S.Row>
            <S.Col>
              <S.Label color={colors.textColor}>Data de recebimento</S.Label>
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                color={colors.textColor}
                onPress={() => setSelectStartDateModal(true)}>
                <Ionicons
                  name="calendar"
                  size={RFPercentage(4)}
                  color={colors.textColor}
                />
                <S.Option
                  color={colors.textColor}
                  style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              {isSameMonth(new Date(), selectedDate) && !expanseState && (
                <>
                  <S.Label
                    color={colors.textColor}
                    style={{ width: '100%', textAlign: 'right' }}>
                    Pago
                  </S.Label>
                  <Switch
                    value={paid}
                    onChange={() => setPaid(!paid)}
                    thumbColor={
                      paid
                        ? colors.thumbColor?.true || '#000'
                        : colors.thumbColor?.false || '#000'
                    }
                    trackColor={colors.trackColor}
                  />
                </>
              )}
            </S.SwitchContainer>
          </S.Row>

          <ControlledInput
            label="Conta padrão de recebimento"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="receiptDefault"
            control={control}
            value={
              expanseState?.receiptDefault ? expanseState.receiptDefault : ''
            }
            selectItems={[
              ...accounts,
              ...creditCards.map(e => {
                return { ...e, name: `Cartão - ${e.name}` };
              }),
            ]}
          />

          <ControlledInput
            label="Categoria"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="category"
            control={control}
            value={expanseState?.category ? expanseState.category : ''}
            selectItems={ExpanseCategories}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={colors.saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitExpanse)}
            />
          </S.ButtonContainer>
        </KeyboardAwareScrollView>

        <DatePicker
          confirmText="Confirmar"
          modal
          open={selectStartDateModal}
          date={startDate}
          title="Selecione a data de recebimento"
          mode="date"
          minimumDate={startOfMonth(selectedDate)}
          maximumDate={lastDayOfMonth(selectedDate)}
          onConfirm={date => {
            setSelectStartDateModal(false);
            setStartDate(date);
          }}
          onCancel={() => {
            setSelectStartDateModal(false);
          }}
        />
        <ModalComponent
          type="loading"
          visible={loading}
          transparent
          title={expanseState ? 'Atualizando...' : 'Criando...'}
          animationType="slide"
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          theme={theme}
        />
        {messages && (
          <ModalComponent
            type={messages.type}
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
        )}
      </S.Container>
      <Menu />
    </>
  );
}
