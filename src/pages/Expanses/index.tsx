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

import { useAccount } from '../../hooks/AccountContext';
import { useDate } from '../../hooks/DateContext';
import { useTheme } from '../../hooks/ThemeContext';

import { Nav } from '../../routes';
import { ExpanseList, Income, IncomeList } from '../../interfaces/Income';
import {
  getCurrentExpanses,
  getCurrentIncomes,
  getEstimateIncomes,
} from '../../utils/getCurrentBalance';
import { getMonthName } from '../../utils/dateFormats';
import {
  CreateIncomeOnAccount,
  IncomeOnAccount,
} from '../../interfaces/IncomeOnAccount';
// import ConfirmReceivedModalComponent from './Components/ConfirmReceivedModal';
import { differenceInMonths, isAfter, isBefore, isSameMonth } from 'date-fns';
import { useAuth } from '../../hooks/AuthContext';
import { getExpansesColors } from '../../utils/colors/expanses';
import {
  CreateExpanseOnAccount,
  ExpanseOnAccount,
} from '../../interfaces/ExpanseOnAccount';
import { Expanse } from '../../interfaces/Expanse';
import ConfirmReceivedModalComponent from './Components/ConfirmReceivedModal';
import ModalComponent from '../../components/Modal';
import api from '../../services/api';

export default function Expanses() {
  const navigation = useNavigation<Nav>();
  const {
    expanses,
    expansesOnAccounts,
    getUserExpanses,
    handleCreateExpanseOnAccount,
    accounts,
    accountSelected,
    handleUpdateAccountBalance,
    getUserExpansesOnAccount,
  } = useAccount();
  const { user } = useAuth();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [expanseByDate, setExpanseByDate] = useState<
    { day: number; expanses: IncomeList[] }[]
  >([]);
  const [expanseSelected, setExpanseSelected] = useState<any>();
  const [currentExpanses, setCurrentExpanses] = useState<Expanse[]>();
  const [currentExpansesOnAccount, setCurrentExpansesOnAccount] =
    useState<ExpanseOnAccount[]>();
  const [confirmReceivedVisible, setConfirmReceivedVisible] = useState(false);
  const [currentTotalExpanses, setCurrentTotalExpanses] = useState(0);
  const [estimateTotalExpanses, setEstimateTotalExpanses] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [editSucessfully, setEditSucessfully] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(
    'Erro ao atualizar informações',
  );
  const [confirmUnreceivedVisible, setConfirmUnreceivedVisible] =
    useState(false);

  const colors = getExpansesColors(theme);

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
    async (expanse: ExpanseList) => {
      setIsDeleteModalVisible(false);
      setLoadingMessage('Excluindo...');
      setIsSubmitting(true);

      try {
        if (expanse?.expanseId) {
          await handleToggleExpanseOnAccount(expanse);
          await api.delete(`expanses/${expanse.expanseId}/${user?.id}`);
          await getUserExpanses();
          return;
        }
        await api.delete(`expanses/${expanse.id}/${user?.id}`);
        await getUserExpanses();
      } catch (error: any) {
        if (error?.response?.data?.message)
          setErrorMessage(error?.response?.data?.message);
        setHasError(true);
      } finally {
        setIsSubmitting(false);
      }
    },
    [user],
  );

  const handleToggleExpanseOnAccount = useCallback(
    async (expanse: any) => {
      if (user) {
        if (expanse.month) {
          setLoadingMessage('Excluindo pagamento...');
          setIsSubmitting(true);
          try {
            await api.delete(`expanses/onAccount/${expanse.id}/${user.id}`);

            const account = accounts.find(acc => acc.id === expanse.accountId);

            const accountLastBalance = account?.balances?.find(balance => {
              if (isSameMonth(new Date(balance.month), selectedDate)) {
                return balance;
              }
            });

            await handleUpdateAccountBalance(
              accountLastBalance,
              expanse.value,
              account,
              'Income',
            );

            await getUserExpansesOnAccount();
            setConfirmUnreceivedVisible(false);
            return;
          } catch (error: any) {
            if (error?.response?.data?.message)
              setErrorMessage(error?.response?.data?.message);
            setHasError(true);
          } finally {
            setIsSubmitting(false);
          }
        } else {
          setLoadingMessage('Pagando...');
          setIsSubmitting(true);
          const input: CreateExpanseOnAccount = {
            userId: user.id,
            accountId: expanse.receiptDefault || accountSelected?.id,
            expanseId: expanse?.id,
            month: selectedDate,
            value: expanse.value,
            name: expanse.name,
            recurrence: expanse.endDate
              ? `${differenceInMonths(
                  selectedDate,
                  new Date(expanse.startDate),
                )}/${differenceInMonths(
                  selectedDate,
                  new Date(expanse.endDate),
                )}`
              : 'mensal',
          };
          try {
            await handleCreateExpanseOnAccount(input);

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
              'Expanse',
            );
            await getUserExpansesOnAccount();
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
      handleCreateExpanseOnAccount,
      accountSelected,
      selectedDate,
      user,
    ],
  );

  const loadData = useCallback(() => {
    const expansesInThisMonth = expanses.filter(exp =>
      exp.endDate
        ? (isBefore(selectedDate, new Date(exp.endDate)) ||
            isSameMonth(new Date(exp.endDate), selectedDate)) &&
          (isAfter(selectedDate, new Date(exp.startDate)) ||
            isSameMonth(new Date(exp.startDate), selectedDate))
        : exp.endDate === null &&
          (isAfter(selectedDate, new Date(exp.startDate)) ||
            isSameMonth(new Date(exp.startDate), selectedDate)),
    );

    setCurrentExpanses(expansesInThisMonth);

    const expansesOnAccountInThisMonth = expansesOnAccounts.filter(i =>
      isSameMonth(new Date(i.month), selectedDate),
    );

    setCurrentExpansesOnAccount(expansesOnAccountInThisMonth);

    const expansesWithoutAccount = expansesInThisMonth.filter(expanse => {
      if (expansesOnAccountInThisMonth.find(i => i.expanseId === expanse.id)) {
        // console.log('ta pago', income);
        return false;
      } else {
        // console.log('não ta pago', income);
        return true;
      }
    });

    const expansesOrdered = expansesWithoutAccount.sort(
      (a, b) =>
        new Date(a.receiptDate).getDate() - new Date(b.receiptDate).getDate(),
    );
    const expansesOrderedByDay: any[] = [];

    expansesOrdered.filter(entry => {
      if (
        expansesOrderedByDay.find(
          item => item.day === new Date(entry.receiptDate).getDate(),
        )
      ) {
        return false;
      }
      expansesOrderedByDay.push({
        day: new Date(entry.receiptDate).getDate(),
      });
      return true;
    });

    expansesOnAccountInThisMonth.filter(entry => {
      if (
        expansesOrderedByDay.find(
          item => item.day === new Date(entry.month).getDate(),
        )
      ) {
        return false;
      }
      expansesOrderedByDay.push({
        day: new Date(entry.month).getDate(),
      });
      return true;
    });

    expansesOrderedByDay.map(item => {
      item.expanses = expansesWithoutAccount.filter(
        expanse => new Date(expanse.receiptDate).getDate() === item.day,
      );
      item.expanses = [
        ...item.expanses,
        ...expansesOnAccountInThisMonth.filter(
          expanse => new Date(expanse.month).getDate() === item.day,
        ),
      ];
    });

    setExpanseByDate(expansesOrderedByDay.sort((a, b) => a.day - b.day));
    setIsLoading(false);
  }, [expanses, expansesOnAccounts, selectedDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (currentExpanses && currentExpansesOnAccount) {
      const currentTotal = getCurrentExpanses(currentExpansesOnAccount);
      setCurrentTotalExpanses(currentTotal);
      const currentMonth = new Date();
      currentMonth.setDate(1);
      currentMonth.setUTCHours(0, 0, 0, 0);
      if (isBefore(selectedDate, currentMonth)) {
        setEstimateTotalExpanses(currentTotal);
      } else {
        setEstimateTotalExpanses(getEstimateIncomes(currentExpanses));
      }
    }
  }, [currentExpansesOnAccount, currentExpanses, selectedDate]);

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
              title="Despesas"
              values={{
                current: currentTotalExpanses,
                estimate: estimateTotalExpanses,
              }}
              type={null}
            />
          </>
        )}
      </S.Container>

      <S.IncomesTitle>
        <S.TitleItem selected>
          <Icon
            name="arrow-down-circle"
            size={RFPercentage(4)}
            color={colors.titleColor}
          />
          <S.IncomesTitleText color={colors.titleColor}>
            Despesas
          </S.IncomesTitleText>
        </S.TitleItem>

        <S.TitleItem selected={false}>
          <Icon name="card" size={RFPercentage(4)} color={colors.titleColor} />
          <S.IncomesTitleText color={colors.titleColor}>
            Cartões
          </S.IncomesTitleText>
        </S.TitleItem>
      </S.IncomesTitle>

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
          {expanseByDate.length > 0 &&
            expanseByDate.map(item => (
              <S.ItemView key={item.day}>
                <S.DateTitle color={colors.dateTitleColor}>
                  {item.day} de {getMonthName(selectedDate)}
                </S.DateTitle>

                {item.expanses.map(expanse => (
                  <ItemCard
                    key={expanse.id}
                    icon={MoneyIcon}
                    title={expanse?.name || ''}
                    value={expanse.value}
                    received={!!expanse?.paymentDate}
                    mainColor={colors.primaryColor}
                    handleRemove={() => {
                      setExpanseSelected(expanse);
                      setIsDeleteModalVisible(true);
                    }}
                    backgroundColor={colors.secondaryCardLoader}
                    onSwitchChange={() => {
                      setExpanseSelected(expanse);
                      if (expanse?.month) {
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
      {!isLoading && expanseByDate.length === 0 && (
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

      <ConfirmReceivedModalComponent
        visible={confirmReceivedVisible}
        handleCancel={() => setConfirmReceivedVisible(false)}
        onRequestClose={() => setConfirmReceivedVisible(false)}
        transparent
        title="Em qual conta a despesa será paga?"
        animationType="slide"
        defaulAccount={expanseSelected?.receiptDefault}
        handleConfirm={() => handleToggleExpanseOnAccount(expanseSelected)}
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
        title="Despesa paga com sucesso!"
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
        handleConfirm={() => handleRemove(expanseSelected)}
      />

      <ModalComponent
        type="confirmation"
        visible={confirmUnreceivedVisible}
        handleCancel={() => setConfirmUnreceivedVisible(false)}
        onRequestClose={() => setConfirmUnreceivedVisible(false)}
        transparent
        title="Tem certeza? Essa despesa será marcada como não paga."
        animationType="slide"
        handleConfirm={() => handleToggleExpanseOnAccount(expanseSelected)}
      />

      <Menu />
    </>
  );
}
