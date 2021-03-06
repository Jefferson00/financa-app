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
  differenceInMonths,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import * as S from './styles';

import { useAuth } from '../../../hooks/AuthContext';
import { useTheme } from '../../../hooks/ThemeContext';
import { useAccount } from '../../../hooks/AccountContext';
import { useDate } from '../../../hooks/DateContext';

import Menu from '../../../components/Menu';
import Header from '../../../components/Header';
import ControlledInput from '../../../components/ControlledInput';
import Button from '../../../components/Button';
import ModalComponent from '../../../components/Modal';
import Input from '../../../components/Input';

import api from '../../../services/api';
import { Nav } from '../../../routes';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { currencyToValue } from '../../../utils/masks';
import { IncomeCategories } from '../../../utils/categories';
import { getCreateIncomesColors } from '../../../utils/colors/incomes';
import { Switch } from 'react-native';
import { CreateIncomeOnAccount } from '../../../interfaces/IncomeOnAccount';
import { Income } from '../../../interfaces/Income';

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
    .required('Campo obrig??torio')
    .min(2, 'deve ter no m??nimo 2 caracteres')
    .max(25, 'deve ter no m??ximo 25 caracteres'),
});

export default function CreateIncome(props: IncomeProps) {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const {
    accounts,
    getUserIncomes,
    handleClearCache,
    handleCreateIncomeOnAccount,
    getUserIncomesOnAccount,
    handleUpdateAccountBalance,
  } = useAccount();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const colors = getCreateIncomesColors(theme);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incomeState] = useState(props?.route?.params?.income);
  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [iteration, setIteration] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [startDate, setStartDate] = useState(selectedDate);
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [received, setReceived] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informa????es',
  );

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: incomeState?.name || '',
      value: incomeState?.value
        ? getCurrencyFormat(incomeState?.value)
        : getCurrencyFormat(0),
      status: false,
      receiptDefault:
        incomeState?.receiptDefault ||
        accounts.filter(a => a.status === 'active')[0].id,
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
    receiptDefault?: string;
    category: string | number;
  };

  const handleOkSucess = () => {
    setEditSucessfully(false);
    setTimeout(() => navigation.navigate('Incomes'), 300);
  };

  const receiveIncome = async (income: Income) => {
    if (user) {
      const input: CreateIncomeOnAccount = {
        userId: user.id,
        accountId: income.receiptDefault,
        incomeId: income?.id,
        month: selectedDate,
        value: income.value,
        name: income.name,
        recurrence: income.endDate
          ? `${
              differenceInMonths(selectedDate, new Date(income.startDate)) + 1
            }/${differenceInMonths(selectedDate, new Date(income.endDate)) + 1}`
          : 'mensal',
      };

      await handleCreateIncomeOnAccount(input);

      const account = accounts.find(acc => acc.id === input.accountId);

      const accountLastBalance = account?.balances?.find(balance => {
        if (isSameMonth(new Date(balance.month), selectedDate)) {
          return balance;
        }
      });

      await handleUpdateAccountBalance(
        accountLastBalance,
        input.value,
        account,
        'Income',
      );

      await getUserIncomesOnAccount();
    }
  };

  const handleSubmitIncome = async (data: FormData) => {
    setIsSubmitting(true);
    const incomeInput = {
      name: data.name,
      userId: user?.id,
      value: Number(currencyToValue(data.value)),
      category:
        IncomeCategories.find(i => i.id === Number(data.category))?.name ||
        data.category,
      iteration: recurrence === 'Parcelada' ? String(iteration) : 'Mensal',
      receiptDate: startDate,
      startDate,
      endDate:
        recurrence === 'Parcelada' ? addMonths(startDate, iteration - 1) : null,
      receiptDefault: data.receiptDefault ? data.receiptDefault : null,
    };
    try {
      if (incomeState) {
        await api.put(`incomes/${incomeState.id}`, incomeInput);
        // atualizar o nome em incomesAccount
      } else {
        const { data } = await api.post(`incomes`, incomeInput);

        if (received) {
          // se tiver marcado como recebido, criar incomeAccount
          receiveIncome(data);
        }
      }

      handleClearCache();
      await getUserIncomes();
      setEditSucessfully(true);
    } catch (error: any) {
      if (error?.response?.data?.message)
        setErrorMessage(error?.response?.data?.message);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (incomeState?.iteration !== 'Mensal') {
      setIteration(incomeState?.iteration);
    } else {
      setRecurrence('Mensal');
    }
  }, [incomeState]);

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
            {incomeState ? `Editar Entrada` : `Nova Entrada`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={incomeState?.name ? incomeState.name : ''}
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
            value={incomeState?.value ? String(incomeState.value) : '0'}
          />

          <S.Label color={colors.textColor}>Recorr??ncia</S.Label>
          <S.Row>
            <S.SelectOption
              onPress={() => setRecurrence('Mensal')}
              checked={recurrence === 'Mensal'}>
              <S.Option>Mensal</S.Option>
              <IonIcons name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <S.SelectOption
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option>Parcelada</S.Option>
              <IonIcons name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <Input
              background={colors.inputBackground}
              textColor={colors.textColor}
              value={
                iteration <= 0 || isNaN(iteration) ? '1' : String(iteration)
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
              <S.SelectOption onPress={() => setSelectStartDateModal(true)}>
                <IonIcons name="calendar" size={RFPercentage(4)} />
                <S.Option style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              {isSameMonth(new Date(), selectedDate) && !incomeState && (
                <>
                  <S.Label
                    color={colors.textColor}
                    style={{ width: '100%', textAlign: 'right' }}>
                    Recebido
                  </S.Label>
                  <Switch
                    value={received}
                    onChange={() => setReceived(!received)}
                    thumbColor={
                      received
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
            label="Conta padr??o de recebimento"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="receiptDefault"
            control={control}
            value={
              incomeState?.receiptDefault ? incomeState.receiptDefault : ''
            }
            selectItems={accounts.filter(acc => acc.status === 'active')}
          />

          <ControlledInput
            label="Categoria"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="category"
            control={control}
            value={incomeState?.category ? incomeState.category : 'Outro'}
            selectItems={IncomeCategories}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={colors.saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitIncome)}
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
          visible={isSubmitting}
          transparent
          title={incomeState ? 'Atualizando...' : 'Criando...'}
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
            incomeState
              ? 'Entrada atualizada com sucesso!'
              : 'Entrada criada com sucesso!'
          }
          animationType="slide"
          handleCancel={() => setEditSucessfully(false)}
          onSucessOkButton={handleOkSucess}
        />
      </S.Container>
      <Menu />
    </>
  );
}
