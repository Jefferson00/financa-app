import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Switch, TouchableOpacity, View, ViewProps } from 'react-native';
import { AnimateProps } from 'react-native-reanimated';
import Icons from 'react-native-vector-icons/Feather';
import { Nav } from '../../../../routes';
import { ICreditCard, Invoice } from '../../../../interfaces/CreditCards';
import * as S from './styles';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
import { getDayOfTheMounth } from '../../../../utils/dateFormats';
// import { PencilSimpleLine, Trash, WarningCircle } from 'phosphor-react-native';
import { Modal } from '../../../../components/NewModal';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../../interfaces/State';
import { useAuth } from '../../../../hooks/AuthContext';
import { payInvoice } from '../../../../store/modules/CreditCards/fetchActions';

interface VisibleContentProps extends AnimateProps<ViewProps> {
  backgroundColor: string;
  creditCard: ICreditCard;
  currentInvoice: Invoice | undefined;
  onDelete?: () => void;
}

export function VisibleContent({
  backgroundColor,
  creditCard,
  currentInvoice,
  onDelete,
  ...rest
}: VisibleContentProps) {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<any>();
  const { user } = useAuth();
  const { accounts } = useSelector((state: State) => state.accounts);

  const [isPaymentModalVisible, setIsPaymentModalVisible] = useState(false);
  const formatedInvoiceValue = getCurrencyFormat(currentInvoice?.value || 0);
  const formatedCreditCardLimit = getCurrencyFormat(creditCard.limit);
  const formatedPaymentDate = getDayOfTheMounth(
    new Date(
      currentInvoice?.paymentDate
        ? currentInvoice?.paymentDate
        : creditCard.paymentDate,
    ),
  );

  const toggleConfirmPaymentModalVisibility = () => {
    setIsPaymentModalVisible(pervState => !pervState);
  };

  const handlePayInvoice = async () => {
    // toggleConfirmPaymentModalVisibility();

    if (user && currentInvoice && !currentInvoice.paid) {
      dispatch(payInvoice(currentInvoice.id, user.id));
    }
  };

  return (
    <>
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
                name="edit-3"
                color={creditCard.color}
                size={RFPercentage(4)}
              />
            </S.Button>
            {!creditCard.Invoice.find(
              inv => inv.ExpanseOnInvoice.length > 0,
            ) && (
              <S.Button
                onPress={onDelete}
                style={{
                  marginLeft: 8,
                }}>
                <Icons
                  name="trash-2"
                  color={creditCard.color}
                  size={RFPercentage(4)}
                />
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
                  <S.Text color="#fff" fontWeight="Regular">
                    Pagar fatura
                  </S.Text>
                )}
              </S.Row>
              {currentInvoice?.closed && !currentInvoice.paid && (
                <Switch
                  value={currentInvoice.paid}
                  onChange={toggleConfirmPaymentModalVisibility}
                  thumbColor="#fff"
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

      <Modal
        accounts={accounts}
        defaulAccount={currentInvoice?.accountId}
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Em qual conta deseja pagar essa fatura?',
          loadingText: 'Pagando fatura...',
        }}
        requestConfirm={handlePayInvoice}
        defaultConfirm={toggleConfirmPaymentModalVisibility}
        onCancel={toggleConfirmPaymentModalVisibility}
        visible={isPaymentModalVisible}
        type="AccountConfirmation"
      />
    </>
  );
}
