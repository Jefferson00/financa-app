import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';

import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Card from '../../components/Card';
import Button from '../../components/Button';
import ItemCard from '../../components/ItemCard';
import ModalComponent from '../../components/Modal';

import { useAccount } from '../../hooks/AccountContext';
import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';

import { Nav } from '../../routes';
import { Income, IncomeList } from '../../interfaces/Income';
import {
  getCurrentIncomes,
  getEstimateIncomes,
} from '../../utils/getCurrentBalance';
import { getMonthName } from '../../utils/dateFormats';
import {
  CreateIncomeOnAccount,
  IncomeOnAccount,
} from '../../interfaces/IncomeOnAccount';
import { getIncomesColors } from '../../utils/colors/incomes';
import ConfirmReceivedModalComponent from './Components/ConfirmReceivedModal';
import { differenceInMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import { useAuth } from '../../hooks/AuthContext';
import api from '../../services/api';

export default function Incomes() {
  const navigation = useNavigation<Nav>();
  const {
    incomes,
    handleCreateIncomeOnAccount,
    accounts,
    incomesOnAccounts,
    accountSelected,
    handleUpdateAccountBalance,
    getUserIncomesOnAccount,
    getUserIncomes,
    handleClearCache,
    handleSelectAccount,
  } = useAccount();
  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [incomesByDate, setIncomesByDate] = useState<
    { day: number; incomes: IncomeList[] }[]
  >([]);
  const [incomeSelected, setIncomeSelected] = useState<any>();
  const [currentIncomes, setCurrentIncomes] = useState<Income[]>();
  const [currentIncomesOnAccount, setCurrentIncomesOnAccount] =
    useState<IncomeOnAccount[]>();
  const [confirmReceivedVisible, setConfirmReceivedVisible] = useState(false);
  const [confirmUnreceivedVisible, setConfirmUnreceivedVisible] =
    useState(false);
  const [currentTotalIncomes, setCurrentTotalIncomes] = useState(0);
  const [estimateTotalIncomes, setEstimateTotalIncomes] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
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

  const handleRemove = useCallback(
    async (income: IncomeList) => {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);
      const findIncome = incomes.filter(
        i => i.id === income.id || i.id === income?.incomeId,
      );
      if (findIncome.length === 0) {
        await handleToggleIncomeOnAccount(income);
        setIsSubmitting(false);
        return;
      }

      try {
        if (income?.incomeId) {
          await api.delete(`incomes/${income.incomeId}/${user?.id}`);
          handleClearCache();
          await getUserIncomes();
          return;
        }
        await api.delete(`incomes/${income.id}/${user?.id}`);
        handleClearCache();
        await getUserIncomes();
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user, incomes],
  );

  const handleToggleIncomeOnAccount = useCallback(
    async (income: any) => {
      if (user) {
        if (income.month) {
          try {
            await api.delete(`incomes/onAccount/${income.id}/${user.id}`);

            const account = accounts.find(acc => acc.id === income.accountId);

            const accountLastBalance = account?.balances?.find(balance => {
              if (isSameMonth(new Date(balance.month), selectedDate)) {
                return balance;
              }
            });

            await handleUpdateAccountBalance(
              accountLastBalance,
              income.value,
              account,
              'Expanse',
            );

            await getUserIncomesOnAccount();
            setConfirmUnreceivedVisible(false);
            return;
          } catch (error: any) {
            if (error?.response?.data?.message)
              setErrorMessage(error?.response?.data?.message);
            setHasError(true);
          }
        } else {
          setLoadingMessage('Recebendo...');
          setIsSubmitting(true);
          const input: CreateIncomeOnAccount = {
            userId: user.id,
            accountId: income.receiptDefault || accountSelected?.id,
            incomeId: income?.id,
            month: selectedDate,
            value: income.value,
            name: income.name,
            recurrence: income.endDate
              ? `${
                  differenceInMonths(selectedDate, new Date(income.startDate)) +
                  1
                }/${
                  differenceInMonths(selectedDate, new Date(income.endDate)) + 1
                }`
              : 'mensal',
          };
          try {
            await handleCreateIncomeOnAccount(input);

            const account = accounts.find(acc => acc.id === input.accountId);

            const accountLastBalance = account?.balances?.find(balance => {
              if (isSameMonth(new Date(balance.month), selectedDate)) {
                return balance;
              }
            });

            await handleUpdateAccountBalance(
              accountLastBalance,
              input.value,
              account,
              'Income',
            );

            await getUserIncomesOnAccount();
            setEditSucessfully(true);
          } catch (error: any) {
            if (error?.response?.data?.message)
              setErrorMessage(error?.response?.data?.message);
            setHasError(true);
          } finally {
            setIsSubmitting(false);
          }
        }
      }
    },
    [
      accounts,
      handleCreateIncomeOnAccount,
      accountSelected,
      selectedDate,
      user,
    ],
  );

  useEffect(() => {
    const incomesInThisMonth = incomes.filter(i =>
      i.endDate
        ? (isBefore(selectedDate, new Date(i.endDate)) ||
            isSameMonth(new Date(i.endDate), selectedDate)) &&
          (isAfter(selectedDate, new Date(i.startDate)) ||
            isSameMonth(new Date(i.startDate), selectedDate))
        : i.endDate === null &&
          (isAfter(selectedDate, new Date(i.startDate)) ||
            isSameMonth(new Date(i.startDate), selectedDate)),
    );

    setCurrentIncomes(incomesInThisMonth);

    const incomesOnAccountInThisMonth = incomesOnAccounts.filter(i =>
      isSameMonth(new Date(i.month), selectedDate),
    );

    setCurrentIncomesOnAccount(incomesOnAccountInThisMonth);

    const incomesWithoutAccount = incomesInThisMonth.filter(income => {
      if (incomesOnAccountInThisMonth.find(i => i.incomeId === income.id)) {
        // console.log('ta pago', income);
        return false;
      } else {
        // console.log('não ta pago', income);
        return true;
      }
    });

    const incomesOrdered = incomesWithoutAccount.sort(
      (a, b) =>
        new Date(a.receiptDate).getDate() - new Date(b.receiptDate).getDate(),
    );
    const incomesOrderedByDay: any[] = [];

    incomesOrdered.filter(entry => {
      if (
        incomesOrderedByDay.find(
          item => item.day === new Date(entry.receiptDate).getDate(),
        )
      ) {
        return false;
      }
      incomesOrderedByDay.push({
        day: new Date(entry.receiptDate).getDate(),
      });
      return true;
    });

    incomesOnAccountInThisMonth.filter(entry => {
      if (
        incomesOrderedByDay.find(
          item => item.day === new Date(entry.month).getDate(),
        )
      ) {
        return false;
      }
      incomesOrderedByDay.push({
        day: new Date(entry.month).getDate(),
      });
      return true;
    });

    incomesOrderedByDay.map(item => {
      item.incomes = incomesWithoutAccount.filter(
        income => new Date(income.receiptDate).getDate() === item.day,
      );
      item.incomes = [
        ...item.incomes,
        ...incomesOnAccountInThisMonth.filter(
          income => new Date(income.month).getDate() === item.day,
        ),
      ];
    });

    setIncomesByDate(incomesOrderedByDay.sort((a, b) => a.day - b.day));
    setIsLoading(false);
  }, [incomes, incomesOnAccounts, selectedDate]);

  useEffect(() => {
    if (currentIncomes && currentIncomesOnAccount) {
      const currentTotal = getCurrentIncomes(currentIncomesOnAccount);
      setCurrentTotalIncomes(currentTotal);
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setUTCHours(0, 0, 0, 0);
      if (isBefore(selectedDate, currentMonth)) {
        setEstimateTotalIncomes(currentTotal);
      } else {
        setEstimateTotalIncomes(getEstimateIncomes(currentIncomes));
      }
    }
  }, [currentIncomesOnAccount, currentIncomes, selectedDate]);

  return (
    <>
      <Header />
      <S.Container>
        {isLoading && (
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
        {!isLoading && (
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
                current: currentTotalIncomes,
                estimate: estimateTotalIncomes,
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

      {isLoading ? (
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

                {item.incomes.map(income => (
                  <ItemCard
                    key={income.id}
                    icon={MoneyIcon}
                    title={income?.name || income?.income?.name}
                    value={income.value}
                    received={!!income?.paymentDate}
                    mainColor={colors.primaryColor}
                    handleRemove={() => {
                      setIncomeSelected(income);
                      setIsDeleteModalVisible(true);
                    }}
                    backgroundColor={colors.secondaryCardLoader}
                    onSwitchChange={() => {
                      setIncomeSelected(income);
                      if (income?.month) {
                        setConfirmUnreceivedVisible(true);
                      } else {
                        setConfirmReceivedVisible(true);
                      }
                    }}
                  />
                ))}
              </S.ItemView>
            ))}
        </ScrollView>
      )}
      {!isLoading && incomesByDate.length === 0 && (
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
        handleConfirm={() => handleToggleIncomeOnAccount(incomeSelected)}
        accounts={accounts}
      />

      <ModalComponent
        type="loading"
        visible={isSubmitting}
        transparent
        title={loadingMessage}
        animationType="slide"
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
      />
      <ModalComponent
        type="success"
        visible={editSucessfully}
        transparent
        title="Entrada recebida com sucesso!"
        animationType="slide"
        handleCancel={() => setEditSucessfully(false)}
        onSucessOkButton={handleOkSucess}
      />

      <ModalComponent
        type="confirmation"
        visible={isDeleteModalVisible}
        handleCancel={() => setIsDeleteModalVisible(false)}
        onRequestClose={() => setIsDeleteModalVisible(false)}
        transparent
        title="Tem certeza que deseja excluir essa despesa em definitivo?"
        animationType="slide"
        handleConfirm={() => handleRemove(incomeSelected)}
      />

      <ModalComponent
        type="confirmation"
        visible={confirmUnreceivedVisible}
        handleCancel={() => setConfirmUnreceivedVisible(false)}
        onRequestClose={() => setConfirmUnreceivedVisible(false)}
        transparent
        title="Tem certeza? Essa entrada será marcada como não recebida."
        animationType="slide"
        handleConfirm={() => handleToggleIncomeOnAccount(incomeSelected)}
      />
      <Menu />
    </>
  );
}
