import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigation } from '@react-navigation/native';
import FeatherIcons from 'react-native-vector-icons/Feather';
import IonIcons from 'react-native-vector-icons/Ionicons';
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
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as S from './styles';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';
import { useDate } from '../../hooks/DateContext';

import Menu from '../../components/Menu';
import ControlledInput from '../../components/ControlledInput';
import Button from '../../components/Button';
import Input from '../../components/Input';

import { Nav } from '../../routes';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { getDayOfTheMounth, getPreviousMonth } from '../../utils/dateFormats';
import { currencyToValue } from '../../utils/masks';
import { IncomeCategories } from '../../utils/categories';
import { Switch } from 'react-native';
import { ICreateIncomeOnAccount } from '../../interfaces/IncomeOnAccount';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../interfaces/State';
import {
  createIncome,
  createIncomeOnAccount,
  updateIncome,
} from '../../store/modules/Incomes/fetchActions';
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { colors } from '../../styles/colors';
import { Modal } from '../../components/NewModal';

interface IncomeProps {
  route?: {
    key: string;
    name: string;
    params: {
      income?: any;
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

export function CreateIncome(props: IncomeProps) {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<Nav>();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { incomeCreated } = useSelector((state: State) => state.incomes);
  const { user } = useAuth();

  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [incomeState] = useState(props?.route?.params?.income);
  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [iteration, setIteration] = useState(1);
  const [startDate, setStartDate] = useState(selectedDate);
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);
  const [received, setReceived] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: incomeState?.name || '',
      value: incomeState?.value
        ? getCurrencyFormat(incomeState?.value)
        : getCurrencyFormat(0),
      status: false,
      receiptDefault: incomeState?.receiptDefault || accounts[0].id,
      category: IncomeCategories.find(c => c.name === incomeState?.category)
        ? IncomeCategories.find(c => c.name === incomeState?.category)?.id
        : IncomeCategories[0].name,
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

  type FormData = {
    name: string;
    value: string;
    status: boolean;
    receiptDefault: string;
    category: string | number;
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
    setTimeout(() => navigation.navigate('Incomes'), 200);
  };

  const handleSubmitIncome = async (data: FormData) => {
    const interationVerified = iteration === 0 ? 1 : iteration;

    if (user) {
      setIsModalVisible(true);
      const incomeInput = {
        name: data.name,
        userId: user.id,
        value: Number(currencyToValue(data.value)),
        category:
          IncomeCategories.find(i => i.id === Number(data.category))?.name ||
          String(data.category),
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
      if (incomeState) {
        await dispatch(updateIncome(incomeInput, incomeState.id));
      } else {
        await dispatch(createIncome(incomeInput, received));
      }
    }
  };

  useEffect(() => {
    if (incomeState?.iteration !== 'Mensal') {
      setIteration(incomeState?.iteration || 1);
    } else {
      setRecurrence('Mensal');
    }
  }, [incomeState]);

  useEffect(() => {
    if (user && received && incomeCreated) {
      const findAccount = accounts.find(
        acc => acc.id === incomeCreated.receiptDefault,
      );

      const incomeOnAccountToCreate: ICreateIncomeOnAccount = {
        userId: user.id,
        accountId: incomeCreated.receiptDefault,
        incomeId: incomeCreated.id,
        month: new Date(),
        value: incomeCreated.value,
        name: incomeCreated.name,
        recurrence: incomeCreated.iteration,
      };

      if (findAccount) {
        dispatch(createIncomeOnAccount(incomeOnAccountToCreate, findAccount));
        setReceived(false);
      }
    }
  }, [incomeCreated, accounts, received, user, dispatch]);

  const incomeColors = () => {
    if (theme === 'dark') {
      return {
        input_bg: colors.dark[700],
        text: colors.blue[100],
        button_colors: {
          PRIMARY_BACKGROUND: colors.green.dark[500],
          SECOND_BACKGROUND: colors.green.dark[400],
          TEXT: colors.white,
        },
        switch_colors: {
          thumbColor: {
            false: colors.green.dark[400],
            true: colors.green.dark[500],
          },
          trackColor: {
            false: colors.dark[700],
            true: colors.green.dark[400],
          },
        },
      };
    }
    return {
      input_bg: colors.green[100],
      text: colors.gray[900],
      button_colors: {
        PRIMARY_BACKGROUND: colors.green[500],
        SECOND_BACKGROUND: colors.green[400],
        TEXT: colors.white,
      },
      switch_colors: {
        thumbColor: {
          false: colors.green[400],
          true: colors.green[500],
        },
        trackColor: {
          false: colors.green[200],
          true: colors.green[400],
        },
      },
    };
  };

  return (
    <>
      <ReducedHeader
        title={incomeState ? `Editar entrada` : `Nova entrada`}
        variant="income"
      />

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
            background={incomeColors().input_bg}
            textColor={incomeColors().text}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={incomeState?.name ? incomeState.name : ''}
          />

          <ControlledInput
            label="Valor"
            background={incomeColors().input_bg}
            textColor={incomeColors().text}
            returnKeyType="next"
            keyboardType="number-pad"
            name="value"
            control={control}
            currencyFormater
            value={incomeState?.value ? String(incomeState.value) : '0'}
          />

          <S.Label color={incomeColors().text}>Recorrência</S.Label>
          <S.Row>
            <S.SelectOption
              backgroundColor={incomeColors().input_bg}
              onPress={() => setRecurrence('Mensal')}
              color={incomeColors().text}
              checked={recurrence === 'Mensal'}>
              <S.Option color={incomeColors().text}>Mensal</S.Option>
              <IonIcons
                name="checkmark"
                size={RFPercentage(4)}
                color={incomeColors().text}
              />
            </S.SelectOption>

            <S.SelectOption
              backgroundColor={incomeColors().input_bg}
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              color={incomeColors().text}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option color={incomeColors().text}>Parcelada</S.Option>
              <IonIcons
                name="checkmark"
                size={RFPercentage(4)}
                color={incomeColors().text}
              />
            </S.SelectOption>

            <Input
              background={incomeColors().input_bg}
              textColor={incomeColors().text}
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
              <S.Label color={incomeColors().text}>Data de recebimento</S.Label>
              <S.SelectOption
                backgroundColor={incomeColors().input_bg}
                color={incomeColors().text}
                onPress={() => setSelectStartDateModal(true)}>
                <IonIcons
                  name="calendar"
                  size={RFPercentage(4)}
                  color={incomeColors().text}
                />
                <S.Option
                  color={incomeColors().text}
                  style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              {isSameMonth(new Date(), selectedDate) && !incomeState && (
                <>
                  <S.Label
                    color={incomeColors().text}
                    style={{ width: '100%', textAlign: 'right' }}>
                    Recebido
                  </S.Label>
                  <Switch
                    value={received}
                    onChange={() => setReceived(!received)}
                    thumbColor={
                      received
                        ? incomeColors().switch_colors.thumbColor.true
                        : incomeColors().switch_colors.thumbColor.false
                    }
                    trackColor={incomeColors().switch_colors.trackColor}
                  />
                </>
              )}
            </S.SwitchContainer>
          </S.Row>

          <ControlledInput
            label="Conta padrão de recebimento"
            type="select"
            background={incomeColors().input_bg}
            textColor={incomeColors().text}
            name="receiptDefault"
            control={control}
            value={
              incomeState?.receiptDefault ? incomeState.receiptDefault : ''
            }
            selectItems={accounts}
          />

          <ControlledInput
            label="Categoria"
            type="select"
            background={incomeColors().input_bg}
            textColor={incomeColors().text}
            name="category"
            control={control}
            value={incomeState?.category ? incomeState.category : 'Outro'}
            selectItems={IncomeCategories}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={incomeColors().button_colors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitIncome)}
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
        minimumDate={startOfMonth(getPreviousMonth(new Date(selectedDate)))}
        maximumDate={lastDayOfMonth(addMonths(new Date(selectedDate), 1))}
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
          loadingText: incomeState ? 'Atualizando...' : 'Criando...',
        }}
        visible={isModalVisible}
        onCancel={handleCloseModal}
        defaultConfirm={handleCloseModal}
        type="Loading"
      />
      <Menu />
    </>
  );
}
