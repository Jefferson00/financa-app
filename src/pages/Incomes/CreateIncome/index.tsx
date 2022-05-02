import React, { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/AuthContext';
import Menu from '../../../components/Menu';
import { Colors } from '../../../styles/global';
import * as S from './styles';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import ControlledInput from '../../../components/ControlledInput';
import Button from '../../../components/Button';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import api from '../../../services/api';
import ModalComponent from '../../../components/Modal';
import { useTheme } from '../../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Nav } from '../../../routes';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useAccount } from '../../../hooks/AccountContext';
import Input from '../../../components/Input';
import { useDate } from '../../../hooks/DateContext';
import { addMonths, isToday, lastDayOfMonth, startOfMonth } from 'date-fns';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { currencyToValue } from '../../../utils/masks';

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

export default function CreateIncome(props: IncomeProps) {
  const navigation = useNavigation<Nav>();
  const { user } = useAuth();
  const { accounts, getUserIncomes } = useAccount();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incomeState, setIncomeState] = useState(props?.route?.params?.income);

  const [recurrence, setRecurrence] = useState<'Mensal' | 'Parcelada'>(
    'Parcelada',
  );
  const [iteration, setIteration] = useState(1);
  const [hasError, setHasError] = useState(false);
  const [startDate, setStartDate] = useState(selectedDate);
  const [selectStartDateModal, setSelectStartDateModal] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );
  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: incomeState?.name || '',
      value: incomeState?.value
        ? getCurrencyFormat(incomeState?.value)
        : getCurrencyFormat(0),
      status: false,
      receiptDefault: incomeState?.receiptDefault || '',
      category: incomeState?.category || '',
    },
    resolver: yupResolver(schema),
  });

  const titleColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.INCOME_SOFT_DARKER : Colors.INCOME_SOFT_LIGTHER;
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

  const incomeCategories = [
    {
      id: 1,
      name: 'Salário',
    },
    {
      id: 2,
      name: 'Benefício',
    },
    {
      id: 3,
      name: 'Transferência',
    },
    {
      id: 4,
      name: 'Outro',
    },
  ];

  type FormData = {
    name: string;
    value: string;
    status: boolean;
    receiptDefault?: string;
    category: string;
  };

  const saveButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.INCOME_PRIMARY_DARKER
        : Colors.INCOME_PRIMARY_LIGTHER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.INCOME_SECONDARY_DARKER
        : Colors.INCOME_SECONDARY_LIGTHER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  const handleSubmitAccount = async (data: FormData) => {
    setIsSubmitting(true);
    const incomeInput = {
      name: data.name,
      userId: user?.id,
      value: Number(currencyToValue(data.value)),
      category: incomeCategories.find(cat => cat.id === Number(data.category))
        ?.name,
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
      } else {
        const res = await api.post(`incomes`, incomeInput);
        console.log(res);
      }

      await getUserIncomes();
      setEditSucessfully(true);
    } catch (error: any) {
      if (error?.response?.data?.message)
        setErrorMessage(error?.response?.data?.message);
      console.log(error?.response?.data);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }

    console.log(incomeInput);
  };

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
            {incomeState ? `Editar Entrada` : `Nova Entrada`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={inputBackground}
            textColor={textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={incomeState?.name ? incomeState.name : ''}
          />

          <ControlledInput
            label="Valor"
            background={inputBackground}
            textColor={textColor}
            returnKeyType="next"
            keyboardType="number-pad"
            name="value"
            control={control}
            currencyFormater
            value={incomeState?.value ? String(incomeState.value) : '0'}
          />

          <S.Label color={textColor}>Recorrência</S.Label>
          <S.Row>
            <S.SelectOption
              onPress={() => setRecurrence('Mensal')}
              checked={recurrence === 'Mensal'}>
              <S.Option>Mensal</S.Option>
              <Icon name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <S.SelectOption
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option>Parcelada</S.Option>
              <Icon name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <Input
              background={inputBackground}
              textColor={textColor}
              value={String(iteration)}
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
              <S.Label color={textColor}>Data de recebimento</S.Label>
              <S.SelectOption onPress={() => setSelectStartDateModal(true)}>
                <Icon name="calendar" size={RFPercentage(4)} />
                <S.Option style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              <S.Label
                color={textColor}
                style={{ width: '100%', textAlign: 'right' }}>
                Recebido
              </S.Label>
              <ControlledInput
                type="switch"
                background="transparent"
                textColor={textColor}
                name="status"
                control={control}
                value={'false'}
              />
            </S.SwitchContainer>
          </S.Row>

          <ControlledInput
            label="Conta padrão de recebimento"
            type="select"
            background={inputBackground}
            textColor={textColor}
            name="receiptDefault"
            control={control}
            value={
              incomeState?.receiptDefault ? incomeState.receiptDefault : ''
            }
            selectItems={[...accounts, { name: 'Nenhum', id: 0 }]}
          />

          <ControlledInput
            label="Categoria"
            type="select"
            background={inputBackground}
            textColor={textColor}
            name="category"
            control={control}
            value={incomeState?.category ? incomeState.category : ''}
            selectItems={incomeCategories}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitAccount)}
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
        />
      </S.Container>
      <Menu />
    </>
  );
}
