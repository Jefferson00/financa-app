import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import {
  differenceInCalendarMonths,
  isAfter,
  isBefore,
  isSameMonth,
} from 'date-fns';

import * as S from './styles';

import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ItemCard from '../../components/ItemCard';
import ModalComponent from '../../components/Modal';
import ConfirmReceivedModalComponent from './Components/ConfirmReceivedModal';

import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';
import { useAuth } from '../../hooks/AuthContext';

import { Nav } from '../../routes';
import { IIncomes, Income, IncomeList } from '../../interfaces/Income';
import { getCurrentIncomes } from '../../utils/getCurrentBalance';
import { getDayOfTheMounth, getMonthName } from '../../utils/dateFormats';
import {
  ICreateIncomeOnAccount,
  IncomeOnAccount,
} from '../../interfaces/IncomeOnAccount';
import { getIncomesColors } from '../../utils/colors/incomes';
import { reduceString } from '../../utils/reduceString';
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

interface ItemType extends IIncomes, IIncomesOnAccount {}

export default function Incomes() {
  const navigation = useNavigation<Nav>();
  const dispatch = useDispatch<any>();

  const { accounts } = useSelector((state: State) => state.accounts);
  const { incomes, incomesOnAccount, loading } = useSelector(
    (state: State) => state.incomes,
  );

  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [incomesByDate, setIncomesByDate] = useState<
    { day: number; items: ItemType[] }[]
  >([]);
  const [incomeSelected, setIncomeSelected] = useState<any>();
  const [currentIncomes, setCurrentIncomes] = useState<Income[]>();
  const [currentIncomesOnAccount, setCurrentIncomesOnAccount] =
    useState<IncomeOnAccount[]>();
  const [confirmReceivedVisible, setConfirmReceivedVisible] = useState(false);
  const [confirmUnreceivedVisible, setConfirmUnreceivedVisible] =
    useState(false);
  const [
    deleteReceiveConfirmationVisible,
    setDeleteReceiveConfirmationVisible,
  ] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [totalCurrentIncomes, setTotalCurrentIncomes] = useState(0);
  const [totalEstimateIncomes, setTotalEstimateIncomes] = useState(0);
  const [accountIdSelected, setAccountIdSelected] = useState<string | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );

  const colors = getIncomesColors(theme);

  const PlusIcon = () => {
    return <Icon name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const MoneyIcon = () => {
    return (
      <MaterialIcon
        name="attach-money"
        size={RFPercentage(6)}
        color={colors.primaryColor}
      />
    );
  };

  const buttonColors = {
    PRIMARY_BACKGROUND: colors.primaryColor,
    SECOND_BACKGROUND: colors.secondaryColor,
    TEXT: '#fff',
  };

  const handleOkSucess = () => {
    setConfirmReceivedVisible(false);
    setConfirmUnreceivedVisible(false);
    setEditSucessfully(false);
  };

  const handleDelete = useCallback(async () => {
    setIsDeleteModalVisible(false);
    setLoadingMessage('Excluindo...');
    setIsSubmitting(true);
    try {
      if (user && incomeSelected) {
        dispatch(deleteIncome(incomeSelected.id, user.id));
        setIncomeSelected(null);
      }
    } catch (error: any) {
      if (error?.response?.data?.message)
        setErrorMessage(error?.response?.data?.message);
      setHasError(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [user, incomes, incomeSelected]);

  const handleDeleteIncomeOnAccount = async () => {
    if (user && incomeSelected) {
      const findAccount = accounts.find(
        acc =>
          acc.id === accountIdSelected ||
          acc.id === incomeSelected.receiptDefault,
      );

      if (findAccount) {
        setLoadingMessage('Excluindo recebimento...');
        setIsSubmitting(true);
        dispatch(
          deleteIncomeOnAccount(incomeSelected.id, user.id, findAccount),
        );
        setIsSubmitting(false);
        setDeleteReceiveConfirmationVisible(false);
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
        month: new Date(),
        value: incomeSelected.value,
        name: incomeSelected.name,
        recurrence:
          incomeSelected.iteration === 'mensal'
            ? 'mensal'
            : getCurrentIteration(currentPart, incomeSelected.iteration),
      };

      if (findAccount) {
        setLoadingMessage('Recebendo...');
        setIsSubmitting(true);
        dispatch(createIncomeOnAccount(incomeOnAccountToCreate, findAccount));
        setIsSubmitting(false);
      }

      setConfirmReceivedVisible(false);
      setIncomeSelected(null);
    }
  };

  const handleOpenConfirmReceiveModal = (income: ItemType) => {
    setConfirmReceivedVisible(true);
    setAccountIdSelected(income.receiptDefault);
    setIncomeSelected(income);
  };

  const handleOpenConfirmUnreceiveModal = (income: ItemType) => {
    setDeleteReceiveConfirmationVisible(true);
    setAccountIdSelected(income.accountId);
    setIncomeSelected(income);
  };

  const handleOpenDeleteModal = (income: ItemType) => {
    setIncomeSelected(income.income ? income.income : income);
    setIsDeleteModalVisible(true);
  };

  useEffect(() => {
    const incomesList = listByDate(incomes, incomesOnAccount, selectedDate);
    setIncomesByDate(incomesList);
  }, [incomes, incomesOnAccount, selectedDate]);

  useEffect(() => {
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
    setTotalCurrentIncomes(currentTotal);

    if (isBefore(selectedDate, currentMonth)) {
      setTotalEstimateIncomes(currentTotal);
    } else {
      const incomesWithoutAccount = currentIncomes.filter(
        i =>
          !currentIncomesOnAccount.find(
            inOnAccount => inOnAccount.incomeId === i.id,
          ),
      );
      setTotalEstimateIncomes(
        [...incomesWithoutAccount, ...currentIncomesOnAccount].reduce(
          (a, b) => a + (b['value'] || 0),
          0,
        ),
      );
    }
  }, [incomes, incomesOnAccount, selectedDate]);

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
              title="Entradas"
              values={{
                current: totalCurrentIncomes,
                estimate: totalEstimateIncomes,
              }}
              type={null}
            />
          </>
        )}
      </S.Container>

      <S.IncomesTitle>
        <Icon
          name="arrow-down-circle"
          size={RFPercentage(4)}
          color={colors.titleColor}
        />
        <S.IncomesTitleText color={colors.titleColor}>
          Entradas
        </S.IncomesTitleText>
      </S.IncomesTitle>

      <S.ButtonContainer>
        <Button
          title="Nova Entrada"
          icon={PlusIcon}
          colors={buttonColors}
          onPress={() =>
            navigation.navigate('CreateIncome', {
              income: null,
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
          {incomesByDate.length > 0 &&
            incomesByDate.map(item => (
              <S.ItemView key={item.day}>
                <S.DateTitle color={colors.dateTitleColor}>
                  {item.day} de {getMonthName(selectedDate)}
                </S.DateTitle>

                {item.items.map(income => (
                  <ItemCard
                    key={income.id}
                    icon={MoneyIcon}
                    title={income.name}
                    value={income.value}
                    received={!!income?.paymentDate}
                    receivedMessage={
                      income.paymentDate
                        ? `Recebido em ${getDayOfTheMounth(
                            new Date(income.paymentDate),
                          )} - ${reduceString(
                            accounts.find(acc => acc.id === income.accountId)
                              ?.name,
                            16,
                          )}`
                        : 'Receber'
                    }
                    mainColor={colors.primaryColor}
                    textColor={colors.textColor}
                    switchColors={colors.switchColors}
                    handleRemove={() => handleOpenDeleteModal(income)}
                    backgroundColor={colors.secondaryCardLoader}
                    onRedirect={() => {
                      navigation.navigate('CreateIncome', {
                        income: incomes.find(
                          inc =>
                            inc.id === income.id || inc.id === income.incomeId,
                        ),
                      });
                    }}
                    onSwitchChange={() => {
                      if (!income?.paymentDate) {
                        handleOpenConfirmReceiveModal(income);
                      } else {
                        handleOpenConfirmUnreceiveModal(income);
                      }
                    }}
                  />
                ))}
              </S.ItemView>
            ))}
        </ScrollView>
      )}
      {!loading && incomesByDate.length === 0 && (
        <S.Empty>
          <Icon
            name="close-circle"
            size={RFPercentage(4)}
            color={colors.primaryColor}
          />
          <S.EmptyText color={colors.textColor}>
            Nenhuma entrada nesse mês
          </S.EmptyText>
        </S.Empty>
      )}

      <ConfirmReceivedModalComponent
        visible={confirmReceivedVisible}
        handleCancel={() => setConfirmReceivedVisible(false)}
        onRequestClose={() => setConfirmReceivedVisible(false)}
        transparent
        title="Em qual conta a entrada será recebida?"
        animationType="slide"
        defaulAccount={incomeSelected?.receiptDefault}
        handleConfirm={handleReceive}
        accounts={accounts.filter(a => a.status === 'active')}
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
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
      />
      <ModalComponent
        type="success"
        visible={editSucessfully}
        transparent
        title="Entrada recebida com sucesso!"
        animationType="slide"
        handleCancel={() => setEditSucessfully(false)}
        onSucessOkButton={handleOkSucess}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
      />

      <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={handleDelete}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
      />

      <ModalComponent
        type="confirmation"
        visible={deleteReceiveConfirmationVisible}
        handleCancel={() => setDeleteReceiveConfirmationVisible(false)}
        onRequestClose={() => setDeleteReceiveConfirmationVisible(false)}
        transparent
        title="Tem certeza? Essa entrada será marcada como não recebida."
        animationType="slide"
        handleConfirm={handleDeleteIncomeOnAccount}
        backgroundColor={colors.modalBackground}
        color={colors.textColor}
      />
      <Menu />
    </>
  );
}
