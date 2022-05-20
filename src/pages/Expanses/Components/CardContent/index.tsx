import React from 'react';
import {
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
import { CreditCards, Invoice } from '../../../../interfaces/CreditCards';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import Ionicons from 'react-native-vector-icons/Ionicons';

import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useEffect } from 'react';
import { useState } from 'react';
import { isSameMonth } from 'date-fns';
import { useDate } from '../../../../hooks/DateContext';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';

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
  const { selectedDate } = useDate();
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

  useEffect(() => {
    const invoiceThisMonth = creditCard.Invoice.find(invoice =>
      isSameMonth(new Date(invoice.month), selectedDate),
    );

    if (invoiceThisMonth) {
      setCurrentInvoice(invoiceThisMonth);
    }
  }, [selectedDate]);

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
              <TouchableOpacity onPress={onDelete}>
                <Ionicons name="trash" size={RFPercentage(4)} color="#CC3728" />
              </TouchableOpacity>
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
                  <S.Subtitle color="#fff">Pagar fatura</S.Subtitle>
                </S.Row>
                <Switch />
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
                      currentInvoice?.paymentDate || creditCard.paymentDate,
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
          <S.ItemView>
            <S.DateTitle color="#df4242">05 Nov</S.DateTitle>
            <S.ItemCard></S.ItemCard>
            <S.ItemCard></S.ItemCard>
          </S.ItemView>
          <S.ItemView>
            <S.DateTitle color="#df4242">05 Nov</S.DateTitle>
            <S.ItemCard></S.ItemCard>
            <S.ItemCard></S.ItemCard>
          </S.ItemView>
        </View>
      </S.HiddenContent>
    </>
  );
}
