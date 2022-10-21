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
} from '../../../interfaces/CreditCards';
import { getCurrencyFormat } from '../../../utils/getCurrencyFormat';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FoundationIcons from 'react-native-vector-icons/Foundation';

import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useEffect } from 'react';
import { useState } from 'react';
import { addMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import { useDate } from '../../../hooks/DateContext';
import { getDayOfTheMounth, getMonthName } from '../../../utils/dateFormats';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import FeatherIcons from 'react-native-vector-icons/Feather';
import ModalComponent from '../../../components/Modal';
import { useAuth } from '../../../hooks/AuthContext';
import { Nav } from '../../../routes';
import { useNavigation } from '@react-navigation/native';
import ConfirmReceivedModalComponent from '../ConfirmReceivedModal';
import { getExpansesColors } from '../../../utils/colors/expanses';
import { useTheme } from '../../../hooks/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../interfaces/State';
import { payInvoice } from '../../../store/modules/CreditCards/fetchActions';
import { deleteExpanseOnInvoice } from '../../../store/modules/Expanses/fetchActions';
import { VisibleContent } from './VisibleContent';
import { HiddenContent } from './HiddenContent';

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
  const dispatch = useDispatch<any>();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { expanses } = useSelector((state: State) => state.expanses);

  const navigation = useNavigation<Nav>();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const { user } = useAuth();

  const [daysState, setDaysState] = useState<number[]>([]);
  const [paidInvoiceDaysState, setPaidInvoiceDaysState] = useState<number[]>(
    [],
  );
  const [currentInvoice, setCurrentInvoice] = useState<Invoice>();
  const [currentPaidInvoiceState, setCurrentPaidInvoiceState] =
    useState<Invoice>();
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

  const colors = getExpansesColors(theme);

  const [expanseSelected, setExpanseSelected] = useState<any>();
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paidSucessfully, setPaidSucessfully] = useState(false);
  const [confirmPaymentModalVisible, setConfirmPaymentModalVisible] =
    useState(false);

  const toggleConfirmPaymentModalVisibility = () => {
    setConfirmPaymentModalVisible(pervState => !pervState);
  };

  const handleOkSucess = () => {
    setPaidSucessfully(false);
  };

  const getCurrentPaidInvoice = useCallback(() => {
    const currentPaidInvoice = creditCard.Invoice.find(
      invoice =>
        isSameMonth(new Date(invoice.month), new Date()) && invoice.paid,
    );
    setCurrentPaidInvoiceState(currentPaidInvoice);

    if (currentPaidInvoice) {
      const days: number[] = [];

      currentPaidInvoice.ExpanseOnInvoice.map(exp => {
        if (!days.find(d => d === exp.day)) days.push(exp.day);
      });

      setPaidInvoiceDaysState(days);
    }
  }, [creditCard]);

  const getInvoiceInThisMonth = useCallback(() => {
    const currentDate = new Date(selectedDate);
    const nextMonth = addMonths(currentDate, 1);

    const invoiceInThisMonth = creditCard.Invoice.find(
      invoice =>
        isSameMonth(new Date(invoice.month), selectedDate) && !invoice.paid,
    );

    const invoiceInNextMonth = creditCard.Invoice.find(invoice =>
      isSameMonth(new Date(invoice.month), nextMonth),
    );

    return invoiceInThisMonth ? invoiceInThisMonth : invoiceInNextMonth;
  }, [selectedDate, creditCard]);

  const getCurrentInvoice = useCallback((invoiceInThisMonth: Invoice) => {
    setCurrentInvoice(invoiceInThisMonth);

    const days: number[] = [];

    invoiceInThisMonth.ExpanseOnInvoice.map(exp => {
      if (!days.find(d => d === exp.day)) days.push(exp.day);
    });

    setDaysState(days);
  }, []);

  const getEstimateInvoice = useCallback(() => {
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
    const days: number[] = [];

    expansesInThisCard.map((exp, index) => {
      const expanseOnInvoiceObject: ExpanseOnInvoice = {
        id: String(index),
        expanseId: exp.id,
        name: exp.name,
        value: exp.value,
        invoiceId: 'any',
        day: new Date(exp.startDate).getUTCDate(),
      };

      expanseOnInvoice.push(expanseOnInvoiceObject);

      if (!days.find(d => d === expanseOnInvoiceObject.day))
        days.push(expanseOnInvoiceObject.day);
      invoiceValue = invoiceValue + exp.value;
    });

    setDaysState(days);
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
      updatedAt: '',
    });
  }, [expanses, selectedDate, creditCard]);

  const handlePayInvoice = useCallback(async () => {
    toggleConfirmPaymentModalVisibility();

    if (user && currentInvoice && !currentInvoice.paid) {
      dispatch(payInvoice(currentInvoice.id, user.id));
    }
  }, [currentInvoice, dispatch, user]);

  const handleDelete = useCallback(
    async (expanse: any) => {
      if (user) {
        if (expanse?.expanseId) {
          dispatch(
            deleteExpanseOnInvoice(expanse.id, expanse.expanseId, user.id),
          );
        }
      }
    },
    [user, dispatch],
  );

  useEffect(() => {
    const invoiceInThisMonth = getInvoiceInThisMonth();
    getCurrentPaidInvoice();

    if (invoiceInThisMonth) {
      getCurrentInvoice(invoiceInThisMonth);
    } else {
      getEstimateInvoice();
    }
  }, [getInvoiceInThisMonth, getCurrentInvoice, getEstimateInvoice]);

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
        <VisibleContent
          style={headerStyle}
          backgroundColor={backgroundColor || '#000'}
          creditCard={creditCard}
          currentInvoice={currentInvoice}
          toggleConfirmPaymentModalVisibility={
            toggleConfirmPaymentModalVisibility
          }
          onDelete={onDelete}
        />
      </TouchableWithoutFeedback>

      <HiddenContent
        backgroundColor={backgroundColor}
        creditCard={creditCard}
        currentInvoice={currentInvoice}
        daysState={daysState}
        heightSharedValue={height}
        onDelete={expanse => {
          setExpanseSelected(expanse);
          setIsDeleteModalVisible(true);
        }}
        viewRef={aref}
        style={style}
      />

      {/*  <ConfirmReceivedModalComponent
        visible={confirmPaymentModalVisible}
        handleCancel={toggleConfirmPaymentModalVisibility}
        onRequestClose={toggleConfirmPaymentModalVisibility}
        transparent
        title="Em qual conta a fatura será paga?"
        animationType="slide"
        defaulAccount={currentInvoice?.accountId}
        handleConfirm={handlePayInvoice}
        accounts={accounts}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      /> */}

      {/*  <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={() => handleRemove(expanseSelected)}
      />
 */}
      {/*  <ModalComponent
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
      <ModalComponent
        type="success"
        visible={paidSucessfully}
        transparent
        title="Fatura paga com sucesso!"
        animationType="slide"
        handleCancel={() => setPaidSucessfully(false)}
        onSucessOkButton={handleOkSucess}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      /> */}
    </>
  );
}
