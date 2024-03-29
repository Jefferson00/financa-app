import React, { useCallback, useEffect, useState } from 'react';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { differenceInCalendarMonths, isBefore } from 'date-fns';
import { Header } from '../../components/NewHeader';
import Menu from '../../components/Menu';
import Button from '../../components/Button';
import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';
import { useAuth } from '../../hooks/AuthContext';
import { Nav } from '../../routes';
import { IIncomes } from '../../interfaces/Income';
import { ICreateIncomeOnAccount } from '../../interfaces/IncomeOnAccount';
import { useDispatch, useSelector } from 'react-redux';
import State from '../../interfaces/State';
import {
  createIncomeOnAccount,
  deleteIncome,
  deleteIncomeOnAccount,
} from '../../store/modules/Incomes/fetchActions';
import { getCurrentIteration } from '../../utils/getCurrentIteration';
import {
  getItemsInThisMonth,
  getItemsOnAccountThisMonth,
  listByDate,
} from '../../utils/listByDate';
import { IIncomesOnAccount } from '../../interfaces/Account';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { ItemsList } from '../../components/ItemsList';
import { Modal } from '../../components/NewModal';

import * as S from './styles';

interface ItemType extends IIncomes, IIncomesOnAccount {}
export interface IncomesItemsByDate {
  day: number;
  items: ItemType[];
}

export default function Incomes() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<any>();

  const { accounts } = useSelector((state: State) => state.accounts);
  const {
    incomes,
    incomesOnAccount,
    loading: loadingIncomes,
  } = useSelector((state: State) => state.incomes);

  const { user } = useAuth();
  const { selectedDate, setLoadingChangeMonth, loadingChangeMonth } = useDate();
  const { theme } = useTheme();
  const [incomesByDate, setIncomesByDate] = useState<
    IncomesItemsByDate[] | null
  >(null);
  const [incomesCached, setIncomesCached] = useState<any | null>(null);
  const [incomeSelected, setIncomeSelected] = useState<any>();
  const [isConfirmReceiveModalVisible, setIsConfirmReceiveModalVisible] =
    useState(false);
  const [isConfirmUnreceiveModalVisible, setIsConfirmUnreceiveModalVisible] =
    useState(false);
  const [totalCurrentIncomes, setTotalCurrentIncomes] = useState(
    getCurrencyFormat(0),
  );
  const [totalEstimateIncomes, setTotalEstimateIncomes] = useState(
    getCurrencyFormat(0),
  );
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemSelected, setItemSelected] = useState<any | null>(null);

  const PlusIcon = () => {
    return <Icon name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const handleOpenConfirmReceiveModal = (income: ItemType) => {
    setIsConfirmReceiveModalVisible(true);
    setAccountIdSelected(income.receiptDefault);
    setIncomeSelected(income);
  };

  const handleCloseConfirmReceiveModal = () => {
    setIsConfirmReceiveModalVisible(false);
    setAccountIdSelected('');
    setIncomeSelected(null);
  };

  const handleOpenConfirmUnreceiveModal = (income: ItemType) => {
    setIsConfirmUnreceiveModalVisible(true);
    setAccountIdSelected(income.accountId);
    setIncomeSelected(income);
  };

  const handleCloseConfirmUnreceiveModal = () => {
    setIsConfirmUnreceiveModalVisible(false);
    setAccountIdSelected('');
    setIncomeSelected(null);
  };

  const handleDeleteIncomeOnAccount = async () => {
    if (user && incomeSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === incomeSelected.receiptDefault,
      );

      if (findAccount) {
        dispatch(
          deleteIncomeOnAccount(incomeSelected.id, user.id, findAccount),
        );
        setIncomeSelected(null);
        setAccountIdSelected(null);
      }
    }
  };

  const handleReceive = async () => {
    if (user && incomeSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === incomeSelected.receiptDefault,
      );

      const currentPart = incomeSelected.endDate
        ? differenceInCalendarMonths(
            new Date(incomeSelected.endDate),
            new Date(),
          )
        : null;

      const incomeOnAccountToCreate: ICreateIncomeOnAccount = {
        userId: user.id,
        accountId: accountIdSelected || incomeSelected.receiptDefault,
        incomeId: incomeSelected.id,
        month: new Date(incomeSelected.startDate),
        value: incomeSelected.value,
        name: incomeSelected.name,
        recurrence:
          incomeSelected.iteration === 'mensal'
            ? 'mensal'
            : getCurrentIteration(currentPart, incomeSelected.iteration),
      };

      if (findAccount) {
        dispatch(createIncomeOnAccount(incomeOnAccountToCreate, findAccount));
      }

      setIncomeSelected(null);
    }
  };

  const openDeleteModal = (income: ItemType) => {
    setIsDeleteModalVisible(true);
    setItemSelected(income.income ? income.income : income);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalVisible(false);
    setItemSelected(null);
  };

  const handleDelete = useCallback(async () => {
    if (user && itemSelected) {
      dispatch(deleteIncome(itemSelected.id, user.id));
      setItemSelected(null);
    }
  }, [user, itemSelected]);

  const headerValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    headerValue.value = event.contentOffset.y;
  });

  const colors = S.incomesColors(theme);

  const width = Dimensions.get('screen').width;

  useFocusEffect(
    useCallback(() => {
      if (incomesCached && incomesCached[String(selectedDate)]) {
        console.log('cache incomes');
        setIncomesByDate(incomesCached[String(selectedDate)]);
      } else {
        console.log('not cache incomes');
        const list = listByDate(incomes, incomesOnAccount, selectedDate);
        setIncomesByDate(list);
        setIncomesCached({
          ...incomesCached,
          [String(selectedDate)]: list,
        });
      }
    }, [incomes, incomesOnAccount, selectedDate]),
  );

  useFocusEffect(
    useCallback(() => {
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setUTCHours(0, 0, 0, 0);

      const currentIncomes = getItemsInThisMonth(incomes, selectedDate);
      const currentIncomesOnAccount = getItemsOnAccountThisMonth(
        incomesOnAccount,
        selectedDate,
      );
      const currentTotal = currentIncomesOnAccount.reduce(
        (a, b) => a + (b['value'] || 0),
        0,
      );
      setTotalCurrentIncomes(getCurrencyFormat(currentTotal));

      if (isBefore(selectedDate, currentMonth)) {
        setTotalEstimateIncomes(getCurrencyFormat(currentTotal));
      } else {
        const incomesWithoutAccount = currentIncomes.filter(
          i =>
            !currentIncomesOnAccount.find(
              inOnAccount => inOnAccount.incomeId === i.id,
            ),
        );
        const estimateIncomes = [
          ...incomesWithoutAccount,
          ...currentIncomesOnAccount,
        ].reduce((a, b) => a + (b['value'] || 0), 0);
        setTotalEstimateIncomes(getCurrencyFormat(estimateIncomes));
      }
    }, [incomes, incomesOnAccount, selectedDate]),
  );

  useFocusEffect(
    useCallback(() => {
      if (incomesByDate) {
        setLoadingChangeMonth(false);
      }
    }, [incomesByDate]),
  );

  return (
    <>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        contentContainerStyle={{
          minHeight: incomesByDate?.length === 0 ? 0 : RFPercentage(140),
          paddingTop: RFPercentage(36),
          paddingBottom: RFPercentage(15),
          paddingHorizontal: RFPercentage(3.2),
        }}
        onScroll={scrollHandler}>
        <S.ButtonContainer>
          <Button
            title="Nova Entrada"
            icon={PlusIcon}
            colors={colors.button}
            onPress={() =>
              navigation.navigate('CreateIncome', {
                income: null,
              })
            }
          />
        </S.ButtonContainer>

        {loadingIncomes || loadingChangeMonth ? (
          <ContentLoader
            viewBox={`0 0 ${width} 325`}
            height={325}
            style={{
              marginTop: RFPercentage(1),
            }}
            backgroundColor={colors.loading.background}
            foregroundColor={colors.loading.foreground}>
            <Rect x="0" y="0" rx="8" ry="8" width={width} height="65" />
            <Rect x="0" y="80" rx="8" ry="8" width={width} height="65" />
            <Rect x="0" y="160" rx="8" ry="8" width={width} height="65" />
            <Rect x="0" y="240" rx="8" ry="8" width={width} height="65" />
          </ContentLoader>
        ) : (
          <ItemsList
            onDelete={openDeleteModal}
            switchActions={{
              onSelect: handleOpenConfirmReceiveModal,
              onUnselect: handleOpenConfirmUnreceiveModal,
            }}
            itemsByDate={incomesByDate || []}
            type="Incomes"
          />
        )}

        {!loadingIncomes && !loadingChangeMonth && incomesByDate?.length === 0 && (
          <S.EmptyContainer>
            <S.EmptyRow>
              <Icon
                name="close-circle"
                size={RFPercentage(4)}
                color={colors.empty.icon}
              />
              <S.EmptyText color={colors.empty.text}>
                Nenhuma entrada nesse mês
              </S.EmptyText>
            </S.EmptyRow>
          </S.EmptyContainer>
        )}
      </Animated.ScrollView>

      <Header
        loading={loadingChangeMonth}
        variant="income"
        headerValue={headerValue}
        colors={colors.header}
        titles={{
          current: 'Entradas',
          estimate: 'Previsto',
        }}
        values={{
          current: totalCurrentIncomes,
          estimate: totalEstimateIncomes,
        }}
      />
      <Menu />

      <Modal
        transparent
        animationType="slide"
        texts={{
          successText: 'Excluido com sucesso!',
          errorText: 'Erro ao excluir',
          confirmationText: 'Tem certeza que deseja excluir?',
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
        defaulAccount={incomeSelected?.receiptDefault}
        transparent
        animationType="slide"
        texts={{
          successText: 'Rececbido com sucesso!',
          errorText: 'Erro ao receber',
          confirmationText: 'Em qual conta deseja receber?',
          loadingText: 'Recebendo...',
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
          successText: 'Rececbido com sucesso!',
          errorText: 'Erro ao receber',
          confirmationText: 'Tem certeza que deseja marcar como não recebido?',
          loadingText: 'Recebendo...',
        }}
        requestConfirm={handleDeleteIncomeOnAccount}
        defaultConfirm={handleCloseConfirmUnreceiveModal}
        onCancel={handleCloseConfirmUnreceiveModal}
        visible={isConfirmUnreceiveModalVisible}
        type="Confirmation"
      />
    </>
  );
}
