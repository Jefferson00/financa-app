import React, { useEffect, useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { isSameMonth } from 'date-fns';
import { View, ViewProps } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import Animated, { AnimateProps, SharedValue } from 'react-native-reanimated';
import FeatherIcons from 'react-native-vector-icons/Feather';
import FoundationIcons from 'react-native-vector-icons/Foundation';
import { useNavigation } from '@react-navigation/native';
import * as S from './styles';
import {
  ExpanseOnInvoice,
  ICreditCard,
  Invoice,
} from '../../../../interfaces/CreditCards';
import { Nav } from '../../../../routes';
import { useSelector } from 'react-redux';
import State from '../../../../interfaces/State';
import { useDate } from '../../../../hooks/DateContext';
import { getDayOfTheMounth, getMonthName } from '../../../../utils/dateFormats';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';

interface VisibleContentProps extends AnimateProps<ViewProps> {
  backgroundColor?: string;
  viewRef: React.RefObject<View>;
  heightSharedValue: SharedValue<number>;
  currentInvoice: Invoice | undefined;
  daysState: number[];
  creditCard: ICreditCard;
  onDelete: (expanse: ExpanseOnInvoice) => void;
}

export function HiddenContent({
  backgroundColor = '#000',
  style,
  viewRef,
  heightSharedValue,
  currentInvoice,
  daysState,
  creditCard,
  onDelete,
  ...rest
}: VisibleContentProps) {
  const navigation = useNavigation<Nav>();
  const { selectedDate } = useDate();
  const { expanses } = useSelector((state: State) => state.expanses);

  const [currentPaidInvoiceState, setCurrentPaidInvoiceState] =
    useState<Invoice>();
  const [paidInvoiceDaysState, setPaidInvoiceDaysState] = useState<number[]>(
    [],
  );

  const invoiceMonthName = currentInvoice
    ? getMonthName(new Date(currentInvoice.month))
    : '';
  const paidInvoiceMonthName = currentPaidInvoiceState
    ? getMonthName(new Date(currentPaidInvoiceState.month))
    : '';

  const paidInvoiceMessage = () => {
    if (currentPaidInvoiceState) {
      const invoicecMonth = getMonthName(
        new Date(currentPaidInvoiceState.month),
      );
      const paidDay = getDayOfTheMounth(
        new Date(currentPaidInvoiceState.updatedAt),
      );
      return `
        Fatura de ${invoicecMonth} paga em 
        ${paidDay}
      `;
    }
    return ``;
  };

  const redirectToCreateExpanse = (expanse: ExpanseOnInvoice) => {
    navigation.navigate('CreateExpanse', {
      expanse: expanses.find(
        exp => exp.id === expanse.id || exp.id === expanse.expanseId,
      ),
    });
  };

  const getCurrentPaidInvoice = () => {
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
  };

  useEffect(() => {
    getCurrentPaidInvoice();
  }, []);

  return (
    <S.HiddenContent
      {...rest}
      style={[{ overflow: 'hidden' }, style]}
      backgroundColor={backgroundColor}>
      <View
        ref={viewRef}
        onLayout={({
          nativeEvent: {
            layout: { height: h },
          },
        }) => (heightSharedValue.value = h)}>
        {currentInvoice &&
          daysState.map((d, index) => (
            <S.ItemView key={index}>
              <S.Text color="#fff">
                {d} de {invoiceMonthName}
              </S.Text>
              {currentInvoice?.ExpanseOnInvoice.filter(
                exp => exp.day === d,
              ).map(expanse => (
                <Swipeable
                  key={expanse.id}
                  renderRightActions={() => (
                    <Animated.View>
                      <View>
                        <S.DeleteButton onPress={() => onDelete(expanse)}>
                          <FeatherIcons name="trash" size={32} color="#fff" />
                        </S.DeleteButton>
                      </View>
                    </Animated.View>
                  )}>
                  <S.ItemCard onPress={() => redirectToCreateExpanse(expanse)}>
                    <S.DollarSign>
                      <FoundationIcons
                        name="dollar"
                        size={RFPercentage(7)}
                        color={backgroundColor}
                      />
                    </S.DollarSign>
                    <S.ItemInfo>
                      <S.Text>{expanse.name}</S.Text>
                      <S.Text>{getCurrencyFormat(expanse.value)}</S.Text>
                    </S.ItemInfo>
                  </S.ItemCard>
                </Swipeable>
              ))}
            </S.ItemView>
          ))}
        {!currentInvoice ||
          (currentInvoice.ExpanseOnInvoice.length === 0 && (
            <S.ItemView>
              <S.ItemCard style={{ justifyContent: 'center' }}>
                <S.ItemInfo>
                  <S.Text>Nenhuma despesa nessa fatura</S.Text>
                </S.ItemInfo>
              </S.ItemCard>
            </S.ItemView>
          ))}

        {currentPaidInvoiceState && isSameMonth(selectedDate, new Date()) && (
          <S.HighlightContainer>
            <S.ItemView>
              <S.Text>{paidInvoiceMessage()}</S.Text>
            </S.ItemView>
            {paidInvoiceDaysState.map(d => (
              <S.ItemView key={Math.random()}>
                <S.Text>
                  {d} de {paidInvoiceMonthName}
                </S.Text>
                {currentPaidInvoiceState?.ExpanseOnInvoice.filter(
                  exp => exp.day === d,
                ).map(expanse => (
                  <S.ItemCard
                    key={expanse.id}
                    onPress={() => redirectToCreateExpanse(expanse)}>
                    <S.DollarSign>
                      <FoundationIcons
                        name="dollar"
                        size={RFPercentage(7)}
                        color={backgroundColor}
                      />
                    </S.DollarSign>
                    <S.ItemInfo>
                      <S.Text>{expanse.name}</S.Text>
                      <S.Text>{getCurrencyFormat(expanse.value)}</S.Text>
                    </S.ItemInfo>
                  </S.ItemCard>
                ))}
              </S.ItemView>
            ))}
          </S.HighlightContainer>
        )}
      </View>
    </S.HiddenContent>
  );
}
