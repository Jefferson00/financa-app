import React, { useCallback } from 'react';
import {
  Animated,
  Switch,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  measure,
  runOnUI,
  useAnimatedRef,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import {
  CreditCards,
  ExpanseOnInvoice,
  Invoice,
} from '../../../../interfaces/CreditCards';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcons from 'react-native-vector-icons/Foundation';

import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useEffect } from 'react';
import { useState } from 'react';
import { addMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import { useDate } from '../../../../hooks/DateContext';
import { getDayOfTheMounth, getMonthName } from '../../../../utils/dateFormats';
import { useAccount } from '../../../../hooks/AccountContext';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FeatherIcons from 'react-native-vector-icons/Feather';
import ModalComponent from '../../../../components/Modal';
import api from '../../../../services/api';
import { useAuth } from '../../../../hooks/AuthContext';
import { Nav } from '../../../../routes';
import { useNavigation } from '@react-navigation/native';

interface CardContentProps {
  backgroundColor?: string;
  creditCard: CreditCards;
  onDelete?: () => void;
}

export default function CardContent({
  creditCard,
  backgroundColor,
  onDelete,
}: CardContentProps) {
  const navigation = useNavigation<Nav>();
  const { selectedDate } = useDate();
  const { user } = useAuth();
  const { expanses, getUserExpanses, getUserCreditCards } = useAccount();
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>();
  const aref = useAnimatedRef<View>();
  const open = useSharedValue(false);
  const progress = useDerivedValue(() =>
    open.value ? withSpring(1) : withTiming(0),
  );
  const height = useSharedValue(0);
  const headerStyle = useAnimatedStyle(() => ({
    borderBottomLeftRadius: progress.value === 0 ? 20 : 0,
    borderBottomRightRadius: progress.value === 0 ? 20 : 0,
  }));
  const style = useAnimatedStyle(() => ({
    height: height.value * progress.value + 1,
    opacity: progress.value === 0 ? 0 : 1,
  }));
  const [expanseSelected, setExpanseSelected] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );

  useEffect(() => {
    const today = new Date(selectedDate);
    const nextMonth = addMonths(today, 1);
    const invoiceThisMonth = creditCard.Invoice.find(
      invoice =>
        isSameMonth(new Date(invoice.month), selectedDate) ||
        isSameMonth(new Date(invoice.month), nextMonth),
    );

    if (invoiceThisMonth) {
      setCurrentInvoice(invoiceThisMonth);
    } else {
      const expansesInThisMonth = expanses.filter(i =>
        i.endDate
          ? (isBefore(selectedDate, new Date(i.endDate)) ||
              isSameMonth(new Date(i.endDate), selectedDate)) &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate))
          : i.endDate === null &&
            (isAfter(selectedDate, new Date(i.startDate)) ||
              isSameMonth(new Date(i.startDate), selectedDate)),
      );

      const expansesInThisCard = expansesInThisMonth.filter(
        exp => exp.receiptDefault === creditCard.id,
      );

      const expanseOnInvoice: ExpanseOnInvoice[] = [];
      let invoiceValue = 0;

      expansesInThisCard.map((exp, index) => {
        const expanseOnInvoiceObject: ExpanseOnInvoice = {
          id: String(index),
          expanseId: exp.id,
          name: exp.name,
          value: exp.value,
          invoiceId: 'any',
          day: new Date(exp.startDate).getDay(),
        };

        expanseOnInvoice.push(expanseOnInvoiceObject);
        invoiceValue = invoiceValue + exp.value;
      });

      const paymentDate = new Date(creditCard.paymentDate);
      paymentDate.setMonth(selectedDate.getMonth());

      setCurrentInvoice({
        accountId: creditCard.receiptDefault,
        closed: true,
        id: 'any',
        paid: true,
        value: invoiceValue,
        paymentDate: paymentDate.toISOString(),
        closingDate: creditCard.invoiceClosing,
        creditCardId: creditCard.id,
        month: selectedDate.toISOString(),
        ExpanseOnInvoice: expanseOnInvoice,
      });
    }
  }, [selectedDate, expanses, creditCard]);

  const handleRemove = useCallback(
    async (expanse: any) => {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);

      try {
        if (expanse?.expanseId) {
          await api.delete(`expanses/${expanse.expanseId}/${user?.id}`);
          await api.delete(`expanses/onInvoice/${expanse.id}/onInvoice`);
          await getUserExpanses();
          await getUserCreditCards();
          return;
        }
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user],
  );

  return (
    <>
      <TouchableWithoutFeedback
        onPress={() => {
          if (height.value === 0) {
            runOnUI(() => {
              'worklet';
              height.value = measure(aref).height;
            })();
          }
          open.value = !open.value;
        }}>
        <S.VisibleContent style={headerStyle} backgroundColor={backgroundColor}>
          <S.Header>
            <S.Title color="#fff">{creditCard.name}</S.Title>

            <S.Row>
              {!creditCard.Invoice.find(
                inv => inv.ExpanseOnInvoice.length > 0,
              ) && (
                <TouchableOpacity onPress={onDelete}>
                  <Ionicons
                    name="trash"
                    size={RFPercentage(4)}
                    color="#CC3728"
                  />
                </TouchableOpacity>
              )}
            </S.Row>
          </S.Header>

          <S.Main>
            <S.Row>
              <View>
                <S.Subtitle color="#fff">Fatura atual</S.Subtitle>
                <S.Title color="#fff">
                  {getCurrencyFormat(currentInvoice?.value || 0)}
                </S.Title>
              </View>

              <View>
                <S.Row>
                  {currentInvoice?.closed && (
                    <TouchableOpacity onPress={onDelete}>
                      <Ionicons
                        name="alert-circle"
                        size={RFPercentage(3)}
                        color="#CC3728"
                        style={{ marginHorizontal: RFPercentage(1) }}
                      />
                    </TouchableOpacity>
                  )}
                  {currentInvoice?.closed && !currentInvoice.paid && (
                    <S.Subtitle color="#fff">Pagar fatura</S.Subtitle>
                  )}
                </S.Row>
                {currentInvoice?.closed && !currentInvoice.paid && <Switch />}
              </View>
            </S.Row>

            <S.Row>
              <View>
                <S.Text color="#fff">Limite disponível</S.Text>
                <S.Text color="#fff">
                  {getCurrencyFormat(creditCard.limit)}
                </S.Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <S.Text color="#fff">Data de pagamento</S.Text>
                <S.Text color="#fff">
                  {getDayOfTheMounth(
                    new Date(
                      currentInvoice?.paymentDate
                        ? currentInvoice?.paymentDate
                        : creditCard.paymentDate,
                    ),
                  )}
                </S.Text>
              </View>
            </S.Row>
          </S.Main>
        </S.VisibleContent>
      </TouchableWithoutFeedback>

      <S.HiddenContent
        style={[{ overflow: 'hidden' }, style]}
        backgroundColor={backgroundColor}>
        <View
          ref={aref}
          onLayout={({
            nativeEvent: {
              layout: { height: h },
            },
          }) => (height.value = h)}>
          {currentInvoice &&
            currentInvoice?.ExpanseOnInvoice.map(expanse => (
              <S.ItemView key={expanse.id}>
                <S.DateTitle color="#fff">
                  {expanse.day} de{' '}
                  {getMonthName(new Date(currentInvoice.month))}
                </S.DateTitle>
                <Swipeable
                  renderRightActions={() => (
                    <Animated.View>
                      <View>
                        <S.DeleteButton
                          onPress={() => {
                            setExpanseSelected(expanse);
                            setIsDeleteModalVisible(true);
                          }}>
                          <FeatherIcons name="trash" size={32} color="#fff" />
                        </S.DeleteButton>
                      </View>
                    </Animated.View>
                  )}>
                  <S.ItemCard
                    onPress={() =>
                      navigation.navigate('CreateExpanse', {
                        expanse: expanses.find(
                          exp =>
                            exp.id === expanse.id ||
                            exp.id === expanse.expanseId,
                        ),
                      })
                    }>
                    <S.DollarSign>
                      <FoundationIcons
                        name="dollar"
                        size={RFPercentage(7)}
                        color={backgroundColor}
                      />
                    </S.DollarSign>
                    <S.ItemInfo>
                      <S.ItemTitle>{expanse.name}</S.ItemTitle>
                      <S.ItemValue>
                        {getCurrencyFormat(expanse.value)}
                      </S.ItemValue>
                    </S.ItemInfo>
                  </S.ItemCard>
                </Swipeable>
              </S.ItemView>
            ))}
          {!currentInvoice ||
            (currentInvoice.ExpanseOnInvoice.length === 0 && (
              <S.ItemView>
                <S.ItemCard style={{ justifyContent: 'center' }}>
                  <S.ItemInfo>
                    <S.ItemTitle>Nenhuma despesa nessa fatura</S.ItemTitle>
                  </S.ItemInfo>
                </S.ItemCard>
              </S.ItemView>
            ))}
        </View>
      </S.HiddenContent>

      <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={() => handleRemove(expanseSelected)}
      />

      <ModalComponent
        type="loading"
        visible={isSubmitting}
        transparent
        title={loadingMessage}
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
    </>
  );
}
