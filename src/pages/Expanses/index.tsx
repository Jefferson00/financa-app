import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ItemCard from '../../components/ItemCard';

import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';

import { Nav } from '../../routes';
import { getDayOfTheMounth, getMonthName } from '../../utils/dateFormats';
import { differenceInCalendarMonths, isBefore } from 'date-fns';
import { useAuth } from '../../hooks/AuthContext';
import { getExpansesColors } from '../../utils/colors/expanses';
import { ICreateExpanseOnAccount } from '../../interfaces/ExpanseOnAccount';
import { IExpanses } from '../../interfaces/Expanse';
import ConfirmReceivedModalComponent from './Components/ConfirmReceivedModal';
import ModalComponent from '../../components/Modal';
import CreditCardsView from './Components/CreditCardsView';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { IExpansesOnAccount } from '../../interfaces/Account';
import {
  getInvoicesThisMonth,
  getItemsInThisMonth,
  getItemsOnAccountThisMonth,
  getPaidInvoicesThisMonth,
  listByDate,
} from '../../utils/listByDate';
import {
  createExpanseOnAccount,
  deleteExpanse,
  deleteExpanseOnAccount,
} from '../../store/modules/Expanses/fetchActions';
import { getCurrentIteration } from '../../utils/getCurrentIteration';
import { removeMessage } from '../../store/modules/Feedbacks';
import AsyncStorage from '@react-native-community/async-storage';
import notifee from '@notifee/react-native';
import { useNotification } from '../../hooks/NotificationContext';

interface ItemType extends IExpanses, IExpansesOnAccount {}

export default function Expanses() {
  const dispatch = useDispatch<any>();
  const navigation = useNavigation<Nav>();
  const { messages } = useSelector((state: State) => state.feedbacks);
  const { accounts } = useSelector((state: State) => state.accounts);
  const { expanses, expansesOnAccount, loading } = useSelector(
    (state: State) => state.expanses,
  );
  const { creditCards } = useSelector((state: State) => state.creditCards);
  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const { getTriggerNotification } = useNotification();

  const [expanseByDate, setExpanseByDate] = useState<
    { day: number; items: ItemType[] }[]
  >([]);
  const [tabSelected, setTabSelected] = useState<'Expanses' | 'Cards'>(
    'Expanses',
  );
  const [expanseSelected, setExpanseSelected] = useState<any>();

  const [confirmReceivedVisible, setConfirmReceivedVisible] = useState(false);

  const [totalCurrentExpanses, setTotalCurrentExpanses] = useState(0);
  const [totalEstimateExpanses, setTotalEstimateExpanses] = useState(0);

  const [showMessage, setShowMessage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );
  const [
    deleteReceiveConfirmationVisible,
    setDeleteReceiveConfirmationVisible,
  ] = useState(false);

  const colors = getExpansesColors(theme);

  const PlusIcon = () => {
    return <Icon name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const buttonColors = {
    PRIMARY_BACKGROUND: colors.primaryColor,
    SECOND_BACKGROUND: colors.secondaryColor,
    TEXT: '#fff',
  };

  const handleOkSucess = () => {
    setConfirmReceivedVisible(false);
    setDeleteReceiveConfirmationVisible(false);
    handleCloseModal();
  };

  const handleCloseModal = () => {
    setShowMessage(false);
    dispatch(removeMessage());
  };

  const handleOpenDeleteModal = (expanse: ItemType) => {
    setExpanseSelected(expanse.expanse ? expanse.expanse : expanse);
    setIsDeleteModalVisible(true);
  };

  const handleOpenConfirmReceiveModal = (expanse: ItemType) => {
    setConfirmReceivedVisible(true);
    setAccountIdSelected(expanse.receiptDefault);
    setExpanseSelected(expanse);
  };

  const handleOpenConfirmUnreceiveModal = (expanse: ItemType) => {
    setDeleteReceiveConfirmationVisible(true);
    setAccountIdSelected(expanse.accountId);
    setExpanseSelected(expanse);
  };

  const handleRemoveNotification = async (expanseId: string) => {
    await AsyncStorage.removeItem(
      `@FinancaAppBeta:expanseEndDate:${expanseId}`,
    );
    const notification = await getTriggerNotification(expanseId);
    if (notification?.notification?.id) {
      await notifee.cancelNotification(notification.notification.id);
    }
  };

  const handleRemove = useCallback(async () => {
    if (user && expanseSelected) {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);
      dispatch(deleteExpanse(expanseSelected.id, user.id));
      await handleRemoveNotification(expanseSelected.id);
      setExpanseSelected(null);
      setIsSubmitting(false);
    }
  }, [user, expanseSelected]);

  const handleDeleteExpanseOnAccount = async () => {
    if (user && expanseSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === expanseSelected.receiptDefault,
      );

      if (findAccount) {
        setLoadingMessage('Excluindo pagamento...');
        setIsSubmitting(true);
        dispatch(
          deleteExpanseOnAccount(expanseSelected.id, user.id, findAccount),
        );
        setDeleteReceiveConfirmationVisible(false);
        setExpanseSelected(null);
        setAccountIdSelected(null);
        setIsSubmitting(false);
      }
    }
  };

  const handleReceive = async () => {
    if (user && expanseSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === expanseSelected.receiptDefault,
      );

      const currentPart = expanseSelected.endDate
        ? differenceInCalendarMonths(
            new Date(expanseSelected.endDate),
            new Date(),
          )
        : null;

      const expanseOnAccountToCreate: ICreateExpanseOnAccount = {
        userId: user.id,
        accountId: accountIdSelected || expanseSelected.receiptDefault,
        expanseId: expanseSelected.id,
        month: new Date(),
        value: expanseSelected.value,
        name: expanseSelected.name,
        recurrence:
          expanseSelected.iteration === 'mensal'
            ? 'mensal'
            : getCurrentIteration(currentPart, expanseSelected.iteration),
      };

      if (findAccount) {
        setLoadingMessage('Pagando...');
        setIsSubmitting(true);
        dispatch(createExpanseOnAccount(expanseOnAccountToCreate, findAccount));
        setIsSubmitting(false);
      }

      setConfirmReceivedVisible(false);
      setExpanseSelected(null);
    }
  };

  const verifyRecurrence = (expanse: ItemType) => {
    let currentPart = null;
    if (expanse.endDate) {
      currentPart = differenceInCalendarMonths(
        new Date(expanse.endDate),
        selectedDate,
      );
    } else if (expanse.expanse && expanse.expanse.endDate) {
      currentPart = differenceInCalendarMonths(
        new Date(expanse.expanse.endDate),
        selectedDate,
      );
    }
    if (expanse.iteration && expanse.iteration.toLowerCase() !== 'mensal') {
      return getCurrentIteration(currentPart, expanse.iteration);
    }
    if (
      expanse.expanse &&
      expanse.expanse.iteration.toLowerCase() !== 'mensal'
    ) {
      return getCurrentIteration(currentPart, expanse.expanse.iteration);
    }
    return '';
  };

  useEffect(() => {
    const expansesWithoutInvoice = expanses.filter(exp =>
      accounts.find(acc => acc.id === exp.receiptDefault),
    );
    const expansesList = listByDate(
      expansesWithoutInvoice,
      expansesOnAccount,
      selectedDate,
    );
    setExpanseByDate(expansesList);
  }, [accounts, expanses, expansesOnAccount, selectedDate]);

  useEffect(() => {
    const invoices = getInvoicesThisMonth(creditCards, selectedDate);
    if (invoices.length > 0) {
      // setHasInvoices(true);
    }
  }, [creditCards, selectedDate]);

  useEffect(() => {
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setUTCHours(0, 0, 0, 0);

    const paidInvoices = getPaidInvoicesThisMonth(creditCards, selectedDate);

    const currentExpanses = getItemsInThisMonth(expanses, selectedDate);
    const currentExpansesOnAccount = getItemsOnAccountThisMonth(
      expansesOnAccount,
      selectedDate,
    );

    const totalInvoice = paidInvoices.reduce(
      (a, b) => a + (b['value'] || 0),
      0,
    );
    const currentTotal = currentExpansesOnAccount.reduce(
      (a, b) => a + (b['value'] || 0),
      0,
    );
    setTotalCurrentExpanses(currentTotal + totalInvoice);

    if (isBefore(selectedDate, currentMonth)) {
      setTotalEstimateExpanses(currentTotal);
    } else {
      const expansesWithoutAccount = currentExpanses.filter(
        i =>
          !currentExpansesOnAccount.find(
            expOnAccount => expOnAccount.expanseId === i.id,
          ),
      );
      setTotalEstimateExpanses(
        [...expansesWithoutAccount, ...currentExpansesOnAccount].reduce(
          (a, b) => a + (b['value'] || 0),
          0,
        ),
      );
    }
  }, [expanses, expansesOnAccount, selectedDate, creditCards]);

  useEffect(() => {
    if (messages) {
      setShowMessage(true);
    }
  }, [messages]);

  return (
    <>
      <Header />
      <S.Container>
        {loading && (
          <ContentLoader
            viewBox="0 0 269 140"
            height={140}
            style={{
              marginBottom: 32,
            }}
            backgroundColor={colors.secondaryCardColor}
            foregroundColor="rgb(255, 255, 255)">
            <Rect x="0" y="0" rx="20" ry="20" width="269" height="140" />
          </ContentLoader>
        )}
        {!loading && (
          <>
            <Card
              id={'income'}
              colors={{
                PRIMARY_BACKGROUND: colors.primaryCardColor,
                SECOND_BACKGROUND: colors.secondaryCardColor,
              }}
              icon={() => (
                <Icon
                  name="arrow-down"
                  size={RFPercentage(5)}
                  color={colors.primaryColor}
                />
              )}
              title="Despesas"
              values={{
                current: totalCurrentExpanses,
                estimate: totalEstimateExpanses,
              }}
              type={null}
            />
          </>
        )}
      </S.Container>

      <S.IncomesTitle>
        <S.TitleItem onPress={() => setTabSelected('Expanses')}>
          <Icon
            name="arrow-down-circle"
            size={RFPercentage(4)}
            color={colors.titleColor}
            style={{ opacity: tabSelected === 'Expanses' ? 1 : 0.5 }}
          />
          <S.IncomesTitleText
            color={colors.titleColor}
            style={{ opacity: tabSelected === 'Expanses' ? 1 : 0.5 }}>
            Despesas
          </S.IncomesTitleText>
        </S.TitleItem>

        <S.TitleItem onPress={() => setTabSelected('Cards')}>
          <Icon
            name="card"
            size={RFPercentage(4)}
            color={colors.titleColor}
            style={{ opacity: tabSelected === 'Cards' ? 1 : 0.5 }}
          />
          <S.IncomesTitleText
            color={colors.titleColor}
            style={{ opacity: tabSelected === 'Cards' ? 1 : 0.5 }}>
            Cartões
          </S.IncomesTitleText>
        </S.TitleItem>
      </S.IncomesTitle>

      {tabSelected === 'Expanses' && (
        <>
          <S.ButtonContainer>
            <Button
              title="Nova Despesa"
              icon={PlusIcon}
              colors={buttonColors}
              onPress={() =>
                navigation.navigate('CreateExpanse', {
                  expanse: null,
                })
              }
            />
          </S.ButtonContainer>

          {loading ? (
            <ContentLoader
              viewBox="0 0 327 100"
              height={100}
              style={{
                marginTop: 32,
              }}
              backgroundColor={colors.secondaryCardLoader}
              foregroundColor="rgb(255, 255, 255)">
              <Rect x="0" y="0" rx="20" ry="20" width="327" height="100" />
            </ContentLoader>
          ) : (
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{
                paddingBottom: RFPercentage(15),
                flex: 1,
                marginTop: RFPercentage(2),
              }}
              contentContainerStyle={{
                paddingBottom: RFPercentage(20),
              }}>
              {expanseByDate.length > 0 &&
                expanseByDate.map(item => (
                  <S.ItemView key={item.day}>
                    <S.DateTitle color={colors.dateTitleColor}>
                      {item.day} de {getMonthName(selectedDate)}
                    </S.DateTitle>

                    {item.items.map(expanse => (
                      <ItemCard
                        key={expanse.id}
                        category={expanse.category}
                        title={expanse?.name || ''}
                        value={expanse.value}
                        received={!!expanse?.paymentDate}
                        recurrence={verifyRecurrence(expanse)}
                        receivedMessage={
                          expanse.paymentDate
                            ? `Recebido em ${getDayOfTheMounth(
                                new Date(expanse.paymentDate),
                              )} - ${
                                accounts.find(
                                  acc => acc.id === expanse.accountId,
                                )?.name
                              }`
                            : 'Receber'
                        }
                        mainColor={colors.primaryColor}
                        textColor={colors.textColor}
                        switchColors={colors.switchColors}
                        handleRemove={() => handleOpenDeleteModal(expanse)}
                        backgroundColor={colors.secondaryCardLoader}
                        onRedirect={() =>
                          navigation.navigate('CreateExpanse', {
                            expanse: expanses.find(
                              exp =>
                                exp.id === expanse.id ||
                                exp.id === expanse.expanseId,
                            ),
                          })
                        }
                        onSwitchChange={() => {
                          if (!expanse?.paymentDate) {
                            handleOpenConfirmReceiveModal(expanse);
                          } else {
                            handleOpenConfirmUnreceiveModal(expanse);
                          }
                        }}
                      />
                    ))}
                  </S.ItemView>
                ))}
            </ScrollView>
          )}
          {!loading && expanseByDate.length === 0 && (
            <S.Empty>
              <Icon
                name="close-circle"
                size={RFPercentage(4)}
                color={colors.primaryColor}
              />
              <S.EmptyText color={colors.textColor}>
                Nenhuma despesa nesse mês
              </S.EmptyText>
            </S.Empty>
          )}
        </>
      )}

      {tabSelected === 'Cards' && <CreditCardsView />}

      <ConfirmReceivedModalComponent
        visible={confirmReceivedVisible}
        handleCancel={() => setConfirmReceivedVisible(false)}
        onRequestClose={() => setConfirmReceivedVisible(false)}
        transparent
        title="Em qual conta a despesa será paga?"
        animationType="slide"
        defaulAccount={expanseSelected?.receiptDefault}
        handleConfirm={handleReceive}
        accounts={accounts}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      />

      <ModalComponent
        type="loading"
        visible={isSubmitting}
        transparent
        title={loadingMessage}
        animationType="slide"
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
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

      <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={handleRemove}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      />

      <ModalComponent
        type="confirmation"
        visible={deleteReceiveConfirmationVisible}
        handleCancel={() => setDeleteReceiveConfirmationVisible(false)}
        onRequestClose={() => setDeleteReceiveConfirmationVisible(false)}
        transparent
        title="Tem certeza que deseja excluir esse pagamento?"
        animationType="slide"
        handleConfirm={handleDeleteExpanseOnAccount}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
        theme={theme}
      />

      <Menu />
    </>
  );
}
