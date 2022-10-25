import React, { useEffect, useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { isSameMonth } from 'date-fns';
import { View, ViewProps } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import DollarIcon from 'react-native-vector-icons/Foundation';
import Icons from 'react-native-vector-icons/Feather';
import Animated, { AnimateProps, SharedValue } from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import * as S from './styles';
import {
  ExpanseOnInvoice,
  ICreditCard,
  Invoice,
} from '../../../../interfaces/CreditCards';
import { Nav } from '../../../../routes';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../../../interfaces/State';
import { useDate } from '../../../../hooks/DateContext';
import { getDayOfTheMounth, getMonthName } from '../../../../utils/dateFormats';
import { getCurrencyFormat } from '../../../../utils/getCurrencyFormat';
// import { CurrencyDollar, Trash } from 'phosphor-react-native';
import { useAuth } from '../../../../hooks/AuthContext';
import {
  deleteExpanse,
  deleteExpanseOnInvoice,
} from '../../../../store/modules/Expanses/fetchActions';
import { Modal } from '../../../../components/NewModal';
import { getCategoryIcon } from '../../../../utils/getCategoryIcon';

interface VisibleContentProps extends AnimateProps<ViewProps> {
  backgroundColor?: string;
  viewRef: React.RefObject<View>;
  heightSharedValue: SharedValue<number>;
  currentInvoice: Invoice | undefined;
  daysState: number[];
  creditCard: ICreditCard;
}

export function HiddenContent({
  backgroundColor = '#000',
  style,
  viewRef,
  heightSharedValue,
  currentInvoice,
  daysState,
  creditCard,
  ...rest
}: VisibleContentProps) {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<any>();

  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { expanses } = useSelector((state: State) => state.expanses);
  const { loading: loadingCreditCards } = useSelector(
    (state: State) => state.creditCards,
  );

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [expanseSelected, setExpanseSelected] = useState<any | null>(null);
  const [currentPaidInvoiceState, setCurrentPaidInvoiceState] =
    useState<Invoice>();
  const [paidInvoiceDaysState, setPaidInvoiceDaysState] = useState<number[]>(
    [],
  );

  const getExpanseCategory = (expanseId: string) => {
    return expanses.find(exp => exp.id === expanseId)?.category || '';
  };

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

  const openDeleteModal = (expanse: any) => {
    setExpanseSelected(expanse);
    setIsDeleteModalVisible(true);
  };

  const closeDeleteModal = () => {
    setExpanseSelected(null);
    setIsDeleteModalVisible(false);
  };

  const handleDelete = async () => {
    if (user && expanseSelected) {
      if (expanseSelected.expanseId) {
        dispatch(
          deleteExpanse(expanseSelected.expanseId, user.id, true),
          /* deleteExpanseOnInvoice(
            expanseSelected.id,
            expanseSelected.expanseId,
            user.id,
          ), */
        );
      }
    }
  };

  useEffect(() => {
    getCurrentPaidInvoice();
  }, [loadingCreditCards]);

  return (
    <>
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
                <S.Text
                  fontWeight="Regular"
                  style={{ marginBottom: RFPercentage(2) }}>
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
                          <S.DeleteButton
                            onPress={() => openDeleteModal(expanse)}>
                            <Icons
                              name="trash-2"
                              size={RFPercentage(4.4)}
                              color={creditCard.color}
                            />
                          </S.DeleteButton>
                        </View>
                      </Animated.View>
                    )}>
                    <View
                      style={{
                        backgroundColor: creditCard.color,
                      }}>
                      <S.ItemCard
                        onPress={() => redirectToCreateExpanse(expanse)}>
                        <S.DollarSign>
                          {getCategoryIcon(
                            getExpanseCategory(expanse.expanseId),
                            backgroundColor,
                            RFPercentage(5),
                          )}
                        </S.DollarSign>
                        <S.ItemInfo>
                          <S.Text
                            fontSize={2}
                            fontWeight="Regular"
                            color="#000">
                            {expanse.name}{' '}
                            {expanse?.recurrence && expanse.recurrence}
                          </S.Text>
                          <S.Text>{getCurrencyFormat(expanse.value)}</S.Text>
                        </S.ItemInfo>
                      </S.ItemCard>
                    </View>
                  </Swipeable>
                ))}
              </S.ItemView>
            ))}
          {!currentInvoice ||
            (currentInvoice.ExpanseOnInvoice.length === 0 && (
              <S.ItemView>
                <S.ItemCard style={{ justifyContent: 'center' }}>
                  <S.ItemInfo>
                    <S.Text fontSize={2} fontWeight="Medium">
                      Nenhuma despesa nessa fatura
                    </S.Text>
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
                        {getCategoryIcon(
                          getExpanseCategory(expanse.expanseId),
                          backgroundColor,
                          RFPercentage(5),
                        )}
                      </S.DollarSign>
                      <S.ItemInfo>
                        <S.Text>
                          {expanse.name}{' '}
                          {expanse?.recurrence && expanse.recurrence}
                        </S.Text>
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

      <Modal
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Tem certeza que deseja excluir?',
          loadingText: 'Excluindo...',
        }}
        requestConfirm={handleDelete}
        defaultConfirm={closeDeleteModal}
        onCancel={closeDeleteModal}
        visible={isDeleteModalVisible}
        type="Confirmation"
      />
    </>
  );
}
