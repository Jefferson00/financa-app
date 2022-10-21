import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Switch, TouchableOpacity, View, ViewProps } from 'react-native';
import Animated, { AnimateProps } from 'react-native-reanimated';
import Icons from 'react-native-vector-icons/Ionicons';
import { Nav } from '../../../../routes';
import { ICreditCard, Invoice } from '../../../../interfaces/CreditCards';
import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';

interface VisibleContentProps extends AnimateProps<ViewProps> {
  backgroundColor: string;
  creditCard: ICreditCard;
  currentInvoice: Invoice | undefined;
  onDelete?: () => void;
  toggleConfirmPaymentModalVisibility: () => void;
}

export function VisibleContent({
  backgroundColor,
  creditCard,
  currentInvoice,
  onDelete,
  toggleConfirmPaymentModalVisibility,
  ...rest
}: VisibleContentProps) {
  const navigation = useNavigation<Nav>();

  const formatedInvoiceValue = getCurrencyFormat(currentInvoice?.value || 0);
  const formatedCreditCardLimit = getCurrencyFormat(creditCard.limit);
  const formatedPaymentDate = getDayOfTheMounth(
    new Date(
      currentInvoice?.paymentDate
        ? currentInvoice?.paymentDate
        : creditCard.paymentDate,
    ),
  );

  return (
    <S.VisibleContent {...rest} backgroundColor={backgroundColor}>
      <S.Header>
        <S.Text color="#fff" fontSize={2.5}>
          {creditCard.name}
        </S.Text>

        <S.Row>
          <S.Button
            onPress={() =>
              navigation.navigate('CreateCreditCard', {
                card: creditCard,
              })
            }>
            <Icons
              name="create"
              size={RFPercentage(4)}
              color={creditCard.color}
              style={{ marginHorizontal: RFPercentage(1) }}
            />
          </S.Button>
          {!creditCard.Invoice.find(inv => inv.ExpanseOnInvoice.length > 0) && (
            <S.Button
              onPress={onDelete}
              style={{
                marginLeft: 8,
              }}>
              <Icons name="trash" size={RFPercentage(4)} color="#CC3728" />
            </S.Button>
          )}
        </S.Row>
      </S.Header>

      <S.Main>
        <S.Row>
          <View>
            <S.Text color="#fff" fontWeight="Regular">
              Fatura atual
            </S.Text>
            <S.Text color="#fff" fontSize={2.5}>
              {formatedInvoiceValue}
            </S.Text>
          </View>

          <View>
            <S.Row>
              {currentInvoice?.closed && !currentInvoice.paid && (
                <TouchableOpacity>
                  <Icons
                    name="alert-circle"
                    size={RFPercentage(3)}
                    color="#CC3728"
                    style={{ marginHorizontal: RFPercentage(1) }}
                  />
                </TouchableOpacity>
              )}
              {currentInvoice?.closed && !currentInvoice.paid && (
                <S.Text color="#fff" fontWeight="Regular">
                  Pagar fatura
                </S.Text>
              )}
            </S.Row>
            {currentInvoice?.closed && !currentInvoice.paid && (
              <Switch
                value={currentInvoice.paid}
                onChange={toggleConfirmPaymentModalVisibility}
              />
            )}
          </View>
        </S.Row>

        <S.Row>
          <View>
            <S.Text fontSize={1.8} fontWeight="Regular" color="#fff">
              Limite disponível
            </S.Text>
            <S.Text fontSize={1.8} fontWeight="Regular" color="#fff">
              {formatedCreditCardLimit}
            </S.Text>
          </View>

          <View style={{ alignItems: 'flex-end' }}>
            <S.Text fontSize={1.8} fontWeight="Regular" color="#fff">
              Data de pagamento
            </S.Text>
            <S.Text fontSize={1.8} fontWeight="Regular" color="#fff">
              {formatedPaymentDate}
            </S.Text>
          </View>
        </S.Row>
      </S.Main>
    </S.VisibleContent>
  );
}

{
  /* <VisibleContent
          backgroundColor={backgroundColor || '#000'}
          creditCard={creditCard}
          currentInvoice={currentInvoice}
          progress={progress}
          toggleConfirmPaymentModalVisibility={
            toggleConfirmPaymentModalVisibility
          }
          onDelete={onDelete}
        /> */
}
