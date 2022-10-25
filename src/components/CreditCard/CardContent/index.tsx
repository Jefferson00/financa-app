import React, { useCallback } from 'react';
import { TouchableWithoutFeedback, View } from 'react-native';
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

import { useEffect } from 'react';
import { useState } from 'react';
import { addMonths, isAfter, isBefore, isSameMonth, subMonths } from 'date-fns';
import { useDate } from '../../../hooks/DateContext';
import { useSelector } from 'react-redux';
import State from '../../../interfaces/State';
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
  const { expanses } = useSelector((state: State) => state.expanses);
  const { creditCards, loading } = useSelector(
    (state: State) => state.creditCards,
  );
  const { selectedDate } = useDate();

  const [daysState, setDaysState] = useState<number[]>([]);
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

    const expansesOnInvoice = [...invoiceInThisMonth.ExpanseOnInvoice];

    expansesOnInvoice.sort((a, b) => a.day - b.day);

    expansesOnInvoice.map(exp => {
      if (!days.find(d => d === exp.day)) days.push(exp.day);
    });

    setDaysState(days);
  }, []);

  const getEstimateInvoice = useCallback(() => {
    const closingReferenceThisMonth = new Date(creditCard.invoiceClosing);
    let closingReferencePrevMonth = new Date(creditCard.invoiceClosing);

    closingReferenceThisMonth.setMonth(selectedDate.getMonth());
    closingReferencePrevMonth.setMonth(selectedDate.getMonth());

    closingReferencePrevMonth = subMonths(closingReferencePrevMonth, 1);

    const expansesInThisMonth = expanses.filter(i =>
      i.endDate
        ? (isBefore(closingReferencePrevMonth, new Date(i.endDate)) ||
            isSameMonth(new Date(i.endDate), closingReferencePrevMonth)) &&
          (isAfter(closingReferenceThisMonth, new Date(i.startDate)) ||
            isSameMonth(new Date(i.startDate), closingReferenceThisMonth))
        : i.endDate === null &&
          (isAfter(closingReferenceThisMonth, new Date(i.startDate)) ||
            isSameMonth(new Date(i.startDate), closingReferenceThisMonth)),
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

  const controller = new AbortController();

  useEffect(() => {
    const invoiceInThisMonth = getInvoiceInThisMonth();

    if (invoiceInThisMonth) {
      getCurrentInvoice(invoiceInThisMonth);
    } else {
      getEstimateInvoice();
    }

    return () => {
      controller.abort();
    };
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
          onDelete={onDelete}
        />
      </TouchableWithoutFeedback>

      <HiddenContent
        backgroundColor={backgroundColor}
        creditCard={creditCard}
        currentInvoice={currentInvoice}
        daysState={daysState}
        heightSharedValue={height}
        viewRef={aref}
        style={style}
      />
    </>
  );
}
