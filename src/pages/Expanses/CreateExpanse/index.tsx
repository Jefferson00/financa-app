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
  differenceInMonths,
  isSameMonth,
  isToday,
  lastDayOfMonth,
  startOfMonth,
} from 'date-fns';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import { useAuth } from '../../../hooks/AuthContext';
import { useAccount } from '../../../hooks/AccountContext';
import { useTheme } from '../../../hooks/ThemeContext';
import { useDate } from '../../../hooks/DateContext';

import Menu from '../../../components/Menu';
import ControlledInput from '../../../components/ControlledInput';
import Button from '../../../components/Button';
import Header from '../../../components/Header';
import ModalComponent from '../../../components/Modal';
import Input from '../../../components/Input';

import * as S from './styles';
import api from '../../../services/api';
import { Nav } from '../../../routes';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { currencyToValue } from '../../../utils/masks';
import { ExpanseCategories } from '../../../utils/categories';
import { getCreateExpansesColors } from '../../../utils/colors/expanses';
import { Switch } from 'react-native';
import { Expanse } from '../../../interfaces/Expanse';
import { CreateExpanseOnAccount } from '../../../interfaces/ExpanseOnAccount';

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
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const {
    accounts,
    creditCards,
    getUserExpanses,
    getUserCreditCards,
    handleCreateExpanseOnAccount,
    getUserExpansesOnAccount,
    handleUpdateAccountBalance,
  } = useAccount();
  const { selectedDate } = useDate();
  const { theme } = useTheme();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanseState, setExpanseState] = useState(
    props?.route?.params?.expanse,
  );

  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [paid, setPaid] = useState(false);
  const [iteration, setIteration] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [startDate, setStartDate] = useState(selectedDate);
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );

  const colors = getCreateExpansesColors(theme);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: expanseState?.name || '',
      value: expanseState?.value
        ? getCurrencyFormat(expanseState?.value)
        : getCurrencyFormat(0),
      status: false,
      receiptDefault:
        expanseState?.receiptDefault ||
        accounts.filter(a => a.status === 'active')[0].id,
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
    receiptDefault?: string;
    category: string | number;
  };

  const handleOkSucess = () => {
    setEditSucessfully(false);
    setTimeout(() => navigation.navigate('Expanses'), 300);
  };

  const payExpanse = async (expanse: Expanse) => {
    if (user) {
      const input: CreateExpanseOnAccount = {
        userId: user.id,
        accountId: expanse.receiptDefault,
        expanseId: expanse?.id,
        month: selectedDate,
        value: expanse.value,
        name: expanse.name,
        recurrence: expanse.endDate
          ? `${differenceInMonths(
              selectedDate,
              new Date(expanse.startDate),
            )}/${differenceInMonths(selectedDate, new Date(expanse.endDate))}`
          : 'mensal',
      };

      await handleCreateExpanseOnAccount(input);

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
        'Expanse',
      );
      await getUserExpansesOnAccount();
    }
  };

  const handleSubmitExpanse = async (data: FormData) => {
    setIsSubmitting(true);
    const expanseInput = {
      name: data.name,
      userId: user?.id,
      value: Number(currencyToValue(data.value)),
      category:
        ExpanseCategories.find(exp => exp.id === Number(data.category))?.name ||
        data.category,
      iteration: recurrence === 'Parcelada' ? String(iteration) : 'Mensal',
      receiptDate: startDate,
      startDate,
      endDate:
        recurrence === 'Parcelada' ? addMonths(startDate, iteration - 1) : null,
      receiptDefault: data.receiptDefault ? data.receiptDefault : null,
    };

    try {
      if (expanseState) {
        await api.put(`expanses/${expanseState.id}`, expanseInput);
      } else {
        const { data } = await api.post(`expanses`, expanseInput);

        const expanseToCreditCard = creditCards.find(
          c => c.id === data.receiptDefault,
        );

        // se tiver marcado como pago, criar expanseAccount
        if (paid && !expanseToCreditCard) {
          payExpanse(data);
        }
      }

      await getUserExpanses();
      await getUserCreditCards();
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

  useEffect(() => {
    if (expanseState?.iteration !== 'Mensal') {
      setIteration(expanseState?.iteration || 1);
    } else {
      setRecurrence('Mensal');
    }
  }, [expanseState]);

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
              checked={recurrence === 'Mensal'}>
              <S.Option>Mensal</S.Option>
              <Ionicons name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <S.SelectOption
              backgroundColor={colors.inputBackground}
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option>Parcelada</S.Option>
              <Ionicons name="checkmark" size={RFPercentage(4)} />
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
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                onPress={() => setSelectStartDateModal(true)}>
                <Ionicons name="calendar" size={RFPercentage(4)} />
                <S.Option style={{ marginHorizontal: RFPercentage(2) }}>
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
              ...accounts.filter(a => a.status === 'active'),
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
          visible={isSubmitting}
          transparent
          title={expanseState ? 'Atualizando...' : 'Criando...'}
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
            expanseState
              ? 'Despesa atualizada com sucesso!'
              : 'Despesa criada com sucesso!'
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
