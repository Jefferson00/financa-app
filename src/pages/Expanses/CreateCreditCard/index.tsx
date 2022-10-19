import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../hooks/AuthContext';
import Menu from '../../../components/Menu';
import * as S from './styles';
import { useNavigation } from '@react-navigation/native';
import Icons from 'react-native-vector-icons/Feather';
import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../../components/Header';
import ControlledInput from '../../../components/ControlledInput';
import Button from '../../../components/Button';
import DatePicker from 'react-native-date-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ModalComponent from '../../../components/Modal';
import { useTheme } from '../../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Nav } from '../../../routes';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDate } from '../../../hooks/DateContext';
import { isToday, lastDayOfMonth, startOfMonth } from 'date-fns';
import { getDayOfTheMounth } from '../../../utils/dateFormats';
import { getCreateCreditCardColors } from '../../../utils/colors/expanses';
import { ColorsList } from '../../../utils/cardsColors';
import { TouchableOpacity, View } from 'react-native';
import { currencyToValue } from '../../../utils/masks';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../interfaces/State';
import {
  createCreditCard,
  updateCreditCard,
} from '../../../store/modules/CreditCards/fetchActions';
import { removeMessage } from '../../../store/modules/Feedbacks';

interface CreateCreditCardProps {
  route?: {
    key: string;
    name: string;
    params: {
      card?: any;
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

export default function CreateCreditCard(props: CreateCreditCardProps) {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<Nav>();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { messages } = useSelector((state: State) => state.feedbacks);
  const { loading } = useSelector((state: State) => state.creditCards);

  const { user } = useAuth();

  const { selectedDate } = useDate();
  const { theme } = useTheme();

  const [showMessage, setShowMessage] = useState(false);
  const [creditCardState] = useState(props?.route?.params?.card);
  const [colorState, setColorState] = useState(ColorsList[0].color);
  const [paymentDate, setPaymentDate] = useState(selectedDate);
  const [invoiceClosing, setInvoiceClosing] = useState(selectedDate);
  const [colorSelectModal, setColorSelectModal] = useState(false);
  const [selectPaymentDateModal, setSelectPaymentDateModal] = useState(false);
  const [selectInvoiceClosingModal, setSelectInvoiceClosingModal] =
    useState(false);

  const colors = getCreateCreditCardColors(theme);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: {
      name: creditCardState?.name || '',
      limit: creditCardState?.limit
        ? getCurrencyFormat(creditCardState?.limit)
        : getCurrencyFormat(0),
      receiptDefault: creditCardState?.receiptDefault || accounts[0].id,
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
    limit: string;
    color: string;
    receiptDefault: string;
  };

  const handleOkSucess = () => {
    handleCloseModal();
    setTimeout(() => navigation.navigate('Expanses'), 300);
  };

  const handleCloseModal = () => {
    setShowMessage(false);
    dispatch(removeMessage());
  };

  const handleSubmitCreditCard = async (data: FormData) => {
    if (user) {
      const creditCardInput = {
        name: data.name,
        userId: user?.id,
        limit: Number(currencyToValue(data.limit)),
        paymentDate,
        invoiceClosing,
        color: colorState,
        receiptDefault: data.receiptDefault,
      };

      if (creditCardState) {
        dispatch(updateCreditCard(creditCardInput, creditCardState.id));
      } else {
        dispatch(createCreditCard(creditCardInput));
      }
    }
  };

  useEffect(() => {
    if (creditCardState?.color) setColorState(creditCardState?.color);
    if (creditCardState?.paymentDate)
      setPaymentDate(new Date(creditCardState?.paymentDate));
    if (creditCardState?.invoiceClosing)
      setInvoiceClosing(new Date(creditCardState?.invoiceClosing));
  }, [creditCardState]);

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
            {creditCardState ? `Editar Cartão` : `Novo Cartão`}
          </S.Title>

          <ControlledInput
            label="Nome"
            background={colors.inputBackground}
            textColor={colors.textColor}
            returnKeyType="next"
            autoCapitalize="sentences"
            name="name"
            control={control}
            value={creditCardState?.name ? creditCardState.name : ''}
          />

          <S.Row>
            <S.Col>
              <ControlledInput
                label="Limite"
                background={colors.inputBackground}
                textColor={colors.textColor}
                returnKeyType="next"
                keyboardType="number-pad"
                name="limit"
                control={control}
                currencyFormater
                value={
                  creditCardState?.limit ? String(creditCardState.limit) : '0'
                }
              />
            </S.Col>

            <S.Col style={{ marginLeft: RFPercentage(3) }}>
              <S.Label color={colors.textColor}>Cor</S.Label>
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                onPress={() => setColorSelectModal(true)}>
                <Icon
                  name="color-palette"
                  size={RFPercentage(4)}
                  color={colors.textColor}
                />
                <View
                  style={{
                    marginHorizontal: RFPercentage(2),
                    width: RFPercentage(4.5),
                    height: RFPercentage(4.5),
                    borderRadius: 10,
                    backgroundColor: colorState ? colorState : 'transparent',
                  }}
                />
              </S.SelectOption>
            </S.Col>
          </S.Row>

          <S.Row>
            <S.Col>
              <S.Label color={colors.textColor}>Data de pagamento</S.Label>
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                onPress={() => setSelectPaymentDateModal(true)}
                style={{ width: RFPercentage(20) }}>
                <Icon
                  name="calendar"
                  size={RFPercentage(4)}
                  color={colors.textColor}
                />
                <S.Option
                  style={{ marginHorizontal: RFPercentage(2) }}
                  color={colors.textColor}>
                  {isToday(paymentDate)
                    ? 'Hoje'
                    : getDayOfTheMounth(paymentDate)}
                </S.Option>
              </S.SelectOption>
            </S.Col>
          </S.Row>

          <S.Row>
            <S.Col>
              <S.Label color={colors.textColor}>Fechamento da fatura</S.Label>
              <S.SelectOption
                backgroundColor={colors.inputBackground}
                onPress={() => setSelectInvoiceClosingModal(true)}
                style={{ width: RFPercentage(20) }}>
                <Icon
                  name="calendar"
                  size={RFPercentage(4)}
                  color={colors.textColor}
                />
                <S.Option
                  style={{ marginHorizontal: RFPercentage(2) }}
                  color={colors.textColor}>
                  {isToday(invoiceClosing)
                    ? 'Hoje'
                    : getDayOfTheMounth(invoiceClosing)}
                </S.Option>
              </S.SelectOption>
            </S.Col>
          </S.Row>

          <ControlledInput
            label="Conta padrão de recebimento"
            type="select"
            background={colors.inputBackground}
            textColor={colors.textColor}
            name="receiptDefault"
            control={control}
            value={
              creditCardState?.receiptDefault
                ? creditCardState.receiptDefault
                : ''
            }
            selectItems={accounts}
          />

          <S.ButtonContainer>
            <Button
              title="Salvar"
              colors={colors.saveButtonColors}
              icon={SaveIcon}
              style={{ marginTop: 32 }}
              onPress={handleSubmit(handleSubmitCreditCard)}
            />
          </S.ButtonContainer>
        </KeyboardAwareScrollView>

        <DatePicker
          confirmText="Confirmar"
          modal
          open={selectPaymentDateModal}
          date={paymentDate}
          title="Selecione a data de pagamento"
          mode="date"
          minimumDate={startOfMonth(selectedDate)}
          maximumDate={lastDayOfMonth(selectedDate)}
          onConfirm={date => {
            setSelectPaymentDateModal(false);
            setPaymentDate(date);
          }}
          onCancel={() => {
            setSelectPaymentDateModal(false);
          }}
        />

        <DatePicker
          confirmText="Confirmar"
          modal
          open={selectInvoiceClosingModal}
          date={invoiceClosing}
          title="Selecione a data de fechamento da fatura"
          mode="date"
          minimumDate={startOfMonth(selectedDate)}
          maximumDate={lastDayOfMonth(selectedDate)}
          onConfirm={date => {
            setSelectInvoiceClosingModal(false);
            setInvoiceClosing(date);
          }}
          onCancel={() => {
            setSelectInvoiceClosingModal(false);
          }}
        />

        <ModalComponent
          type="select"
          visible={colorSelectModal}
          transparent
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          selectTitle="Selecione a cor do cartão"
          animationType="slide"
          selectList={ColorsList}
          onRequestClose={() => setColorSelectModal(false)}
          handleCancel={() => setColorSelectModal(false)}
          renderItem={item => (
            <TouchableOpacity
              onPress={() => {
                setColorState(item.color);
                setColorSelectModal(false);
              }}>
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 10,
                  backgroundColor: item.color,
                  borderWidth: colorState === item.color ? 3 : 0,
                  borderColor: colors.textColor,
                }}
              />
            </TouchableOpacity>
          )}
        />

        <ModalComponent
          type="loading"
          backgroundColor={colors.modalBackground}
          color={colors.textColor}
          visible={loading}
          transparent
          title={creditCardState ? 'Atualizando...' : 'Criando...'}
          animationType="slide"
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
