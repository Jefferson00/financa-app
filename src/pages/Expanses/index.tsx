import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Dimensions, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

import { Header } from '../../components/NewHeader';
import Menu from '../../components/Menu';
import Button, { ButtonColors } from '../../components/Button';
import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';
import { Nav } from '../../routes';
import { addMonths, differenceInCalendarMonths, isBefore } from 'date-fns';
import { useAuth } from '../../hooks/AuthContext';
import { ICreateExpanseOnAccount } from '../../interfaces/ExpanseOnAccount';
import { IExpanses } from '../../interfaces/Expanse';
import { CreditCard } from '../../components/CreditCard';
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
import AsyncStorage from '@react-native-community/async-storage';
import notifee from '@notifee/react-native';
import { useNotification } from '../../hooks/NotificationContext';

import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { colors } from '../../styles/colors';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { ItemsList } from '../../components/ItemsList';
import { Modal } from '../../components/NewModal';

interface ItemType extends IExpanses, IExpansesOnAccount {}

export default function Expanses() {
  const width = Dimensions.get('screen').width;
  const dispatch = useDispatch<any>();
  const swipeableRef = useRef<any>(null);
  const navigation = useNavigation<Nav>();
  const { accounts } = useSelector((state: State) => state.accounts);
  const {
    expanses,
    expansesOnAccount,
    loading: loadingExpanses,
  } = useSelector((state: State) => state.expanses);
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
  const [itemSelected, setItemSelected] = useState<any | null>(null);

  const [totalCurrentExpanses, setTotalCurrentExpanses] = useState(
    getCurrencyFormat(0),
  );
  const [totalEstimateExpanses, setTotalEstimateExpanses] = useState(
    getCurrencyFormat(0),
  );
  const [cardsHeight, setCardsHeight] = useState(0);

  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [calcExpanseList, setCalcExpanseList] = useState(true);
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );
  const [isConfirmReceiveModalVisible, setIsConfirmReceiveModalVisible] =
    useState(false);
  const [isConfirmUnreceiveModalVisible, setIsConfirmUnreceiveModalVisible] =
    useState(false);

  const PlusIcon = () => {
    return <Icon name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const handleOpenConfirmReceiveModal = (expanse: ItemType) => {
    setIsConfirmReceiveModalVisible(true);
    setAccountIdSelected(expanse.receiptDefault);
    setExpanseSelected(expanse);
  };

  const handleCloseConfirmReceiveModal = () => {
    setIsConfirmReceiveModalVisible(false);
    setAccountIdSelected('');
    setExpanseSelected(null);
  };

  const handleOpenConfirmUnreceiveModal = (expanse: ItemType) => {
    setIsConfirmUnreceiveModalVisible(true);
    setAccountIdSelected(expanse.accountId);
    setExpanseSelected(expanse);
  };

  const handleCloseConfirmUnreceiveModal = () => {
    setIsConfirmUnreceiveModalVisible(false);
    setAccountIdSelected('');
    setExpanseSelected(null);
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

  const handleDeleteExpanseOnAccount = async () => {
    if (user && expanseSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === expanseSelected.receiptDefault,
      );

      if (findAccount) {
        dispatch(
          deleteExpanseOnAccount(expanseSelected.id, user.id, findAccount),
        );
        setExpanseSelected(null);
        setAccountIdSelected(null);
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
        month: new Date(expanseSelected.startDate), // new Date()
        value: expanseSelected.value,
        name: expanseSelected.name,
        recurrence:
          expanseSelected.iteration === 'mensal'
            ? 'mensal'
            : getCurrentIteration(currentPart, expanseSelected.iteration),
      };

      if (findAccount) {
        dispatch(createExpanseOnAccount(expanseOnAccountToCreate, findAccount));
      }

      setExpanseSelected(null);
    }
  };

  const handleDelete = useCallback(async () => {
    if (user && itemSelected) {
      dispatch(deleteExpanse(itemSelected.id, user.id));
      await handleRemoveNotification(itemSelected.id);
      setItemSelected(null);
    }
  }, [user, itemSelected]);

  const openDeleteModal = (expanse: ItemType) => {
    setIsDeleteModalVisible(true);
    setItemSelected(expanse.expanse ? expanse.expanse : expanse);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setItemSelected(null);
  };

  useEffect(() => {
    setCalcExpanseList(true);

    const expansesWithoutInvoice = expanses.filter(exp =>
      accounts.find(acc => acc.id === exp.receiptDefault),
    );

    const expansesWithInvoice = expanses.filter(
      exp => !accounts.find(acc => acc.id === exp.receiptDefault),
    );

    const expansesWithInvoiceInThisMonth = getItemsInThisMonth(
      expansesWithInvoice,
      selectedDate,
    );
    const expansesWithInvoiceInNextMonth = getItemsInThisMonth(
      expansesWithInvoice,
      addMonths(new Date(), 1),
    );

    setCardsHeight(
      (expansesWithInvoiceInThisMonth.length +
        expansesWithInvoiceInNextMonth.length) *
        25,
    );

    /* console.log(inThisMonth.length);
    console.log(inNextMonth.length); */

    const expansesList = listByDate(
      expansesWithoutInvoice,
      expansesOnAccount,
      selectedDate,
    );
    setExpanseByDate(expansesList);
    setCalcExpanseList(false);
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
    const total = getCurrencyFormat(currentTotal + totalInvoice);
    setTotalCurrentExpanses(total);

    if (isBefore(selectedDate, currentMonth)) {
      setTotalEstimateExpanses(getCurrencyFormat(currentTotal));
    } else {
      const expansesWithoutAccount = currentExpanses.filter(
        i =>
          !currentExpansesOnAccount.find(
            expOnAccount => expOnAccount.expanseId === i.id,
          ),
      );
      const estimateExpanses = [
        ...expansesWithoutAccount,
        ...currentExpansesOnAccount,
      ].reduce((a, b) => a + (b['value'] || 0), 0);
      setTotalEstimateExpanses(getCurrencyFormat(estimateExpanses));
    }
  }, [expanses, expansesOnAccount, selectedDate, creditCards]);

  const headerValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    headerValue.value = event.contentOffset.y;
  });

  const expansesColor = () => {
    if (theme === 'dark') {
      return {
        primary: colors.red.dark[500],
        secondary: colors.red.dark[400],
        title: colors.gray[600],
        text: colors.gray[600],
        icon_circle: colors.dark[700],
      };
    }
    return {
      primary: colors.red[500],
      secondary: colors.red[400],
      title: colors.gray[600],
      text: colors.gray[600],
      icon_circle: colors.red[100],
    };
  };

  const headerColors = () => {
    if (theme === 'dark') {
      return [colors.dark[800], colors.dark[800]];
    }
    return [colors.red[500], colors.red[600]];
  };

  const loadingColors = () => {
    if (theme === 'dark') {
      return {
        background: colors.dark[700],
        foreground: colors.gray[600],
      };
    }
    return {
      background: colors.green[100],
      foreground: colors.white,
    };
  };

  const emptyColors = () => {
    if (theme === 'dark') {
      return {
        icon: colors.dark[700],
        text: colors.blue[200],
      };
    }
    return {
      icon: colors.red[500],
      text: colors.gray[600],
    };
  };

  const buttonColors = (): ButtonColors => {
    if (theme === 'dark') {
      return {
        PRIMARY_BACKGROUND: colors.red.dark[500],
        SECOND_BACKGROUND: colors.red.dark[400],
        TEXT: colors.white,
      };
    }
    return {
      PRIMARY_BACKGROUND: colors.red[500],
      SECOND_BACKGROUND: colors.red[400],
      TEXT: colors.white,
    };
  };

  return (
    <>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          minHeight:
            expanseByDate.length === 0 ? RFPercentage(110) : RFPercentage(30),
          paddingTop: RFPercentage(36),
          paddingBottom: RFPercentage(15),
          paddingHorizontal: RFPercentage(3.2),
        }}
        onScroll={scrollHandler}>
        <S.ButtonContainer>
          <Button
            title="Nova Despesa"
            icon={PlusIcon}
            colors={buttonColors()}
            onPress={() =>
              navigation.navigate('CreateExpanse', {
                expanse: null,
              })
            }
          />
        </S.ButtonContainer>

        <S.Row>
          <S.RowButton
            onPress={() => {
              setTabSelected('Expanses');
              swipeableRef.current.close();
            }}>
            <S.IconCircle
              style={{
                backgroundColor: expansesColor().icon_circle,
                opacity: tabSelected === 'Expanses' ? 1 : 0.5,
              }}>
              <Icon
                name="arrow-down"
                size={RFPercentage(3)}
                color={expansesColor().primary}
              />
            </S.IconCircle>
            <S.Text
              style={{
                opacity: tabSelected === 'Expanses' ? 1 : 0.5,
              }}
              color={expansesColor().title}
              fontSize={2}
              fontWeight="SemiBold">
              Despesas
            </S.Text>
          </S.RowButton>

          <S.RowButton
            onPress={() => {
              swipeableRef.current.openRight();
              setTabSelected('Cards');
            }}>
            <S.IconCircle
              style={{
                backgroundColor: expansesColor().icon_circle,
                opacity: tabSelected === 'Cards' ? 1 : 0.5,
              }}>
              <Icon
                name="card"
                size={RFPercentage(3)}
                color={expansesColor().primary}
              />
            </S.IconCircle>
            <S.Text
              style={{
                opacity: tabSelected === 'Cards' ? 1 : 0.5,
              }}
              color={expansesColor().title}
              fontSize={2}
              fontWeight="SemiBold">
              Cartões
            </S.Text>
          </S.RowButton>
        </S.Row>

        <Swipeable
          ref={swipeableRef}
          containerStyle={{
            backgroundColor: theme === 'dark' ? colors.dark[900] : colors.white,
            minHeight: RFPercentage(tabSelected === 'Cards' ? cardsHeight : 30),
          }}
          childrenContainerStyle={{
            backgroundColor: theme === 'dark' ? colors.dark[900] : colors.white,
            flex: 1,
          }}
          renderRightActions={() => <CreditCard />}
          onSwipeableRightOpen={() => setTabSelected('Cards')}
          onSwipeableClose={() => setTabSelected('Expanses')}>
          {loadingExpanses || calcExpanseList ? (
            <ContentLoader
              viewBox={`0 0 ${width} 325`}
              height={325}
              style={{
                marginTop: RFPercentage(1),
              }}
              backgroundColor={loadingColors().background}
              foregroundColor={loadingColors().foreground}>
              <Rect x="0" y="0" rx="8" ry="8" width={width} height="65" />
              <Rect x="0" y="80" rx="8" ry="8" width={width} height="65" />
              <Rect x="0" y="160" rx="8" ry="8" width={width} height="65" />
              <Rect x="0" y="240" rx="8" ry="8" width={width} height="65" />
            </ContentLoader>
          ) : (
            <ItemsList
              showTitle={false}
              onDelete={openDeleteModal}
              switchActions={{
                onSelect: handleOpenConfirmReceiveModal,
                onUnselect: handleOpenConfirmUnreceiveModal,
              }}
              itemsByDate={expanseByDate}
              type="Expanses"
            />
          )}

          {!loadingExpanses && !calcExpanseList && expanseByDate.length === 0 && (
            <S.EmptyContainer
              style={{
                backgroundColor:
                  theme === 'dark' ? colors.dark[900] : colors.white,
              }}>
              <S.EmptyRow>
                <Icon
                  name="close-circle"
                  size={RFPercentage(4)}
                  color={emptyColors().icon}
                />
                <S.Text
                  style={{
                    marginLeft: 8,
                  }}
                  color={emptyColors().text}
                  fontWeight="SemiBold"
                  fontSize={2}>
                  Nenhuma despesa nesse mês
                </S.Text>
              </S.EmptyRow>
            </S.EmptyContainer>
          )}
        </Swipeable>
      </Animated.ScrollView>

      <Header
        variant="expanse"
        headerValue={headerValue}
        colors={headerColors()}
        titles={{
          current: 'Despesas',
          estimate: 'Previsto',
        }}
        values={{
          current: totalCurrentExpanses,
          estimate: totalEstimateExpanses,
        }}
      />

      <Menu />

      <Modal
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Tem certeza que deseja excluir essa despesa?',
          loadingText: 'Excluindo...',
        }}
        requestConfirm={handleDelete}
        defaultConfirm={closeDeleteModal}
        onCancel={closeDeleteModal}
        visible={isDeleteModalVisible}
        type="Confirmation"
      />

      <Modal
        accounts={accounts}
        defaulAccount={expanseSelected?.receiptDefault}
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Em qual conta deseja pagar essa despesa?',
          loadingText: 'Pagando...',
        }}
        requestConfirm={handleReceive}
        defaultConfirm={handleCloseConfirmReceiveModal}
        onCancel={handleCloseConfirmReceiveModal}
        visible={isConfirmReceiveModalVisible}
        type="AccountConfirmation"
      />

      <Modal
        transparent
        animationType="slide"
        texts={{
          confirmationText: 'Tem certeza que deseja marcar como não pago?',
          loadingText: 'Excluindo pagamento...',
        }}
        requestConfirm={handleDeleteExpanseOnAccount}
        defaultConfirm={handleCloseConfirmUnreceiveModal}
        onCancel={handleCloseConfirmUnreceiveModal}
        visible={isConfirmUnreceiveModalVisible}
        type="Confirmation"
      />
    </>
  );
}
