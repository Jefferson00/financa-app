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
  isBefore,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';
import { useDate } from '../../hooks/DateContext';

import Menu from '../../components/Menu';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import Input from '../../components/Input';

import * as S from './styles';
import { Nav } from '../../routes';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../utils/dateFormats';
import { currencyToValue } from '../../utils/masks';
import { ExpanseCategories } from '../../utils/categories';
import { Switch } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../interfaces/State';
import {
  createExpanse,
  createExpanseOnAccount,
  updateExpanse,
} from '../../store/modules/Expanses/fetchActions';
import { ICreateExpanseOnAccount } from '../../interfaces/ExpanseOnAccount';
import { useNotification } from '../../hooks/NotificationContext';
import AsyncStorage from '@react-native-community/async-storage';
import { addCreatedExpanse } from '../../store/modules/Expanses';
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { Modal } from '../../components/NewModal';
import { colors } from '../../styles/colors';

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

export function CreateExpanse(props: ExpanseProps) {
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

  const [expanseState] = useState(props?.route?.params?.expanse);

  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [paid, setPaid] = useState(false);
  const [iteration, setIteration] = useState(1);
  const [startDate, setStartDate] = useState(
    props?.route?.params?.expanse
      ? new Date(props?.route?.params?.expanse?.startDate)
      : selectedDate,
  );
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const expanseColors = () => {
    if (theme === 'dark') {
      return {
        input_bg: colors.dark[700],
        text: colors.blue[100],
        button_colors: {
          PRIMARY_BACKGROUND: colors.red.dark[500],
          SECOND_BACKGROUND: colors.red.dark[400],
          TEXT: colors.white,
        },
        switch_colors: {
          thumbColor: {
            false: colors.red.dark[400],
            true: colors.red.dark[500],
          },
          trackColor: {
            false: colors.dark[700],
            true: colors.red.dark[400],
          },
        },
      };
    }
    return {
      input_bg: colors.red[100],
      text: colors.gray[900],
      button_colors: {
        PRIMARY_BACKGROUND: colors.red[500],
        SECOND_BACKGROUND: colors.red[400],
        TEXT: colors.white,
      },
      switch_colors: {
        thumbColor: {
          false: colors.red[400],
          true: colors.red[500],
        },
        trackColor: {
          false: colors.red[200],
          true: colors.red[400],
        },
      },
    };
  };

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

  const closeModal = () => {
    setIsModalVisible(false);
    setTimeout(() => navigation.navigate('Expanses'), 200);
  };

  const createExpanseNotification = async (
    expanseId: string,
    expanseName: string,
    startDate: any,
    endDate: any,
  ) => {
    let date = new Date(startDate);
    if (isBefore(new Date(startDate), new Date())) {
      const newStartDate = addMonths(new Date(startDate), 1);
      date = newStartDate;
    }

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
      setIsModalVisible(true);
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

      const creditCardType = !!creditCards.find(
        card => card.id === data.receiptDefault,
      );

      if (expanseState) {
        dispatch(updateExpanse(expanseInput, expanseState.id, creditCardType));
        await updateExpanseNotification(
          expanseState.id,
          expanseInput.name,
          expanseInput.startDate,
          expanseInput.endDate,
        );
      } else {
        dispatch(createExpanse(expanseInput, paid, creditCardType));
      }
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
        month: new Date(expanseCreated.startDate), // new Date()
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

  return (
    <>
      <ReducedHeader
        title={expanseState ? `Editar despesa` : `Nova despesa`}
        variant="expanse"
      />

      <KeyboardAwareScrollView
        resetScrollToCoords={{ x: 0, y: 0 }}
        scrollEnabled
        showsVerticalScrollIndicator={false}
        style={{ width: '100%' }}
        contentContainerStyle={{
          alignItems: 'center',
          paddingBottom: RFPercentage(15),
        }}>
        <S.Container>
          <ControlledInput
            label="Nome"
            background={expanseColors().input_bg}
            textColor={expanseColors().text}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={expanseState?.name ? expanseState.name : ''}
            defaultValue={expanseState?.name ? expanseState.name : ''}
          />

          <ControlledInput
            label="Valor"
            background={expanseColors().input_bg}
            textColor={expanseColors().text}
            returnKeyType="next"
            keyboardType="number-pad"
            name="value"
            control={control}
            currencyFormater
            value={expanseState?.value ? String(expanseState.value) : '0'}
          />

          <S.Label color={expanseColors().text}>Recorrência</S.Label>
          <S.Row>
            <S.SelectOption
              backgroundColor={expanseColors().input_bg}
              onPress={() => setRecurrence('Mensal')}
              color={expanseColors().text}
              checked={recurrence === 'Mensal'}>
              <S.Option color={expanseColors().text}>Mensal</S.Option>
              <Ionicons
                name="checkmark"
                size={RFPercentage(4)}
                color={expanseColors().text}
              />
            </S.SelectOption>

            <S.SelectOption
              backgroundColor={expanseColors().input_bg}
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              color={expanseColors().text}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option color={expanseColors().text}>Parcelada</S.Option>
              <Ionicons
                name="checkmark"
                size={RFPercentage(4)}
                color={expanseColors().text}
              />
            </S.SelectOption>

            <Input
              background={expanseColors().input_bg}
              textColor={expanseColors().text}
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
              <S.Label color={expanseColors().text}>Data de pagamento</S.Label>
              <S.SelectOption
                backgroundColor={expanseColors().input_bg}
                color={expanseColors().text}
                onPress={() => setSelectStartDateModal(true)}>
                <Ionicons
                  name="calendar"
                  size={RFPercentage(4)}
                  color={expanseColors().text}
                />
                <S.Option
                  color={expanseColors().text}
                  style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              {isSameMonth(new Date(), selectedDate) && !expanseState && (
                <>
                  <S.Label
                    color={expanseColors().text}
                    style={{ width: '100%', textAlign: 'right' }}>
                    Pago
                  </S.Label>
                  <Switch
                    value={paid}
                    onChange={() => setPaid(!paid)}
                    thumbColor={
                      paid
                        ? expanseColors().switch_colors.thumbColor.true
                        : expanseColors().switch_colors.thumbColor.false
                    }
                    trackColor={expanseColors().switch_colors.trackColor}
                  />
                </>
              )}
            </S.SwitchContainer>
          </S.Row>

          <ControlledInput
            label="Conta padrão de pagamento"
            type="select"
            background={expanseColors().input_bg}
            textColor={expanseColors().text}
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
            background={expanseColors().input_bg}
            textColor={expanseColors().text}
            name="category"
            control={control}
            value={expanseState?.category ? expanseState.category : ''}
            selectItems={ExpanseCategories}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={expanseColors().button_colors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitExpanse)}
            />
          </S.ButtonContainer>
        </S.Container>
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

      <Modal
        transparent
        animationType="slide"
        texts={{
          loadingText: expanseState ? 'Atualizando...' : 'Criando...',
        }}
        visible={isModalVisible}
        onCancel={closeModal}
        defaultConfirm={closeModal}
        type="Loading"
      />
      <Menu />
    </>
  );
}
