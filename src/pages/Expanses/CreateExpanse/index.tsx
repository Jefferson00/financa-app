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
import { ExpanseCategories } from '../../../utils/categories';
import { getCreateExpansesColors } from '../../../utils/colors/expanses';

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
    expanses,
  } = useAccount();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [deleteConfirmationVisible, setDeleteConfirmationVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [expanseState, setExpanseState] = useState(
    props?.route?.params?.expanse,
  );

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
      <Icons
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

  const handleSubmitAccount = async (data: FormData) => {
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
        await api.post(`expanses`, expanseInput);
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

  /* useEffect(() => {
    const expanseFound = expanses.find(
      exp =>
        exp.id === props?.route?.params?.expanse.id ||
        props?.route?.params?.expanse.expanseId,
    );
    if (expanseFound) setExpanseState(expanseFound);
  }, [props?.route?.params?.expanse, expanses]); */

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
              <Icon name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <S.SelectOption
              backgroundColor={colors.inputBackground}
              onPress={() => setRecurrence('Parcelada')}
              checked={recurrence === 'Parcelada'}
              style={{ marginHorizontal: RFPercentage(2) }}>
              <S.Option>Parcelada</S.Option>
              <Icon name="checkmark" size={RFPercentage(4)} />
            </S.SelectOption>

            <Input
              background={colors.inputBackground}
              textColor={colors.textColor}
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
              <S.Label color={colors.textColor}>Data de recebimento</S.Label>
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                onPress={() => setSelectStartDateModal(true)}>
                <Icon name="calendar" size={RFPercentage(4)} />
                <S.Option style={{ marginHorizontal: RFPercentage(2) }}>
                  {isToday(startDate) ? 'Hoje' : getDayOfTheMounth(startDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>

            <S.SwitchContainer>
              <S.Label
                color={colors.textColor}
                style={{ width: '100%', textAlign: 'right' }}>
                Pago
              </S.Label>
              <ControlledInput
                type="switch"
                background="transparent"
                textColor={colors.textColor}
                name="status"
                control={control}
                value={'false'}
                thumbColor={colors.thumbColor}
                trackColor={colors.trackColor}
              />
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
            selectItems={[...accounts, ...creditCards]}
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
