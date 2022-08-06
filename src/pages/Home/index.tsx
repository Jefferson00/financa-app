import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';

import * as S from './styles';
import Header from '../../components/Header';
import Menu from '../../components/Menu';
import Card from '../../components/Card';
import Estimates from './components/Estimates';
import LastTransactions from './components/LastTransactions';

import { useAccount } from '../../hooks/AccountContext';
import { useTheme } from '../../hooks/ThemeContext';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import { Nav } from '../../routes';
import { getHomeColors } from '../../utils/colors/home';
import AsyncStorage from '@react-native-community/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../hooks/AuthContext';
import { listAccounts } from '../../store/modules/Accounts/fetchActions';
import {
  listExpanses,
  listExpansesOnAccount,
} from '../../store/modules/Expanses/fetchActions';
import {
  listIncomes,
  listIncomesOnAccount,
} from '../../store/modules/Incomes/fetchActions';
import { listCreditCards } from '../../store/modules/CreditCards/fetchActions';
import State from '../../interfaces/State';
import { isSameMonth } from 'date-fns';
import { useDate } from '../../hooks/DateContext';
import { getAccountEstimateBalance } from '../../utils/getAccountBalance';

const defaultAccountCard = {
  id: 0,
  title: 'Adicionar uma nova conta',
  type: 'ADD',
  current_balance: 0,
  estimate_balance: 0,
  account: null,
};

export default function Home() {
  const dispatch = useDispatch<any>();
  const { accounts, loading } = useSelector((state: State) => state.accounts);
  const { incomes, loading: loadingIncomes } = useSelector(
    (state: State) => state.incomes,
  );
  const { expanses, loading: loadingExpanses } = useSelector(
    (state: State) => state.expanses,
  );
  const { creditCards, loading: loadingCreditCards } = useSelector(
    (state: State) => state.creditCards,
  );
  const navigation = useNavigation<Nav>();

  const { user } = useAuth();
  const { theme } = useTheme();
  const { selectedDate } = useDate();
  const width = Dimensions.get('screen').width;

  const [activeSlide, setActiveSlide] = useState(0);
  const [accountCards, setAccountCards] = useState([defaultAccountCard]);
  const [totalEstimateBalance, setTotalEstimateBalance] = useState(0);
  const [totalCurrentBalance, setTotalCurrentBalance] = useState(0);
  const [isLoadingCards, setIsLoadingCards] = useState(true);

  const colors = getHomeColors(theme);

  const handleSetActiveSlide = async (slide: number) => {
    await AsyncStorage.setItem(`@FinancaAppBeta:ActiveSlide`, String(slide));
    setActiveSlide(slide);
  };

  useEffect(() => {
    AsyncStorage.getItem(`@FinancaAppBeta:ActiveSlide`).then(slide => {
      setActiveSlide(Number(slide));
    });
  }, []);

  const loadingAllData = () => {
    return (
      !loading &&
      !loadingIncomes &&
      !loadingExpanses &&
      !loadingCreditCards &&
      !isLoadingCards
    );
  };

  const listAccountCards = useCallback(async () => {
    setIsLoadingCards(true);
    let sumTotalCurrentBalance = 0;
    let sumTotalEstimateBalance = 0;

    const cardsArray: any[] = [];
    const isTheSameMonth = isSameMonth(new Date(), selectedDate);

    await Promise.all(
      accounts.map(async (account, index) => {
        const currentBalance = account.balance;

        const lastMonthEstimateBalance = await AsyncStorage.getItem(
          `@FinancaAppBeta:LastMonthEstimateBalance@${account.id}`,
        );

        const estimateBalance = isTheSameMonth
          ? getAccountEstimateBalance(
              account,
              currentBalance,
              incomes,
              expanses,
              selectedDate,
              creditCards,
            )
          : getAccountEstimateBalance(
              account,
              Number(lastMonthEstimateBalance),
              incomes,
              expanses,
              selectedDate,
              creditCards,
            );

        const currentMonthEstimateBalance = await AsyncStorage.getItem(
          `@FinancaAppBeta:CurrentMonthEstimateBalance@${account.id}@${selectedDate}`,
        );

        if (!currentMonthEstimateBalance) {
          await AsyncStorage.setItem(
            `@FinancaAppBeta:CurrentMonthEstimateBalance@${account.id}@${selectedDate}`,
            String(estimateBalance),
          );
        }

        sumTotalCurrentBalance = sumTotalCurrentBalance + currentBalance;
        sumTotalEstimateBalance =
          isTheSameMonth || !currentMonthEstimateBalance
            ? sumTotalEstimateBalance + estimateBalance
            : sumTotalEstimateBalance + Number(currentMonthEstimateBalance);

        cardsArray.push({
          id: index + 1,
          title: account.name,
          type: account.type,
          current_balance: currentBalance,
          estimate_balance:
            isTheSameMonth || !currentMonthEstimateBalance
              ? estimateBalance
              : currentMonthEstimateBalance,
          account,
        });
      }),
    );

    cardsArray.push({
      id: accounts.length + 1,
      title: 'Adicionar uma nova conta',
      type: 'ADD',
      current_balance: 0,
      estimate_balance: 0,
    });

    setTotalCurrentBalance(sumTotalCurrentBalance);
    setTotalEstimateBalance(sumTotalEstimateBalance);
    setAccountCards(cardsArray);
    setIsLoadingCards(false);
  }, [selectedDate, accounts, incomes, expanses, creditCards]);

  useEffect(() => {
    if (user?.id) {
      dispatch(listAccounts(user.id));
      dispatch(listExpanses(user.id));
      dispatch(listExpansesOnAccount(user.id));
      dispatch(listIncomes(user.id));
      dispatch(listIncomesOnAccount(user.id));
      dispatch(listCreditCards(user.id));
    }
  }, [dispatch, user]);

  useEffect(() => {
    listAccountCards();
  }, [listAccountCards]);

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Header />
        <S.Container>
          {!loadingAllData() ? (
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
          ) : (
            <>
              <Carousel
                data={accountCards}
                onSnapToItem={index => handleSetActiveSlide(index)}
                sliderWidth={width}
                itemWidth={width}
                itemHeight={149}
                firstItem={activeSlide}
                enableSnap
                renderItem={({ item }) => (
                  <Card
                    id={String(item.id)}
                    colors={{
                      PRIMARY_BACKGROUND: colors.primaryCardColor,
                      SECOND_BACKGROUND: colors.secondaryCardColor,
                    }}
                    icon={() => {
                      if (item.type === 'ADD') {
                        return (
                          <Icon
                            name="add-circle"
                            size={RFPercentage(6)}
                            color="#fff"
                          />
                        );
                      } else {
                        return (
                          <Icon
                            name="business"
                            size={RFPercentage(4)}
                            color={colors.secondaryCardColor}
                          />
                        );
                      }
                    }}
                    title={item.title}
                    values={{
                      current: item.current_balance,
                      estimate: item.estimate_balance,
                    }}
                    type={(item.type as 'ADD') || null}
                    handleNavigate={() =>
                      navigation.navigate('Account', {
                        account: item.type !== 'ADD' ? item.account : null,
                      })
                    }
                  />
                )}
              />

              <Pagination
                dotsLength={accountCards.length}
                activeDotIndex={activeSlide}
                dotContainerStyle={{
                  height: 0,
                }}
                containerStyle={{
                  height: 0,
                  position: 'relative',
                  top: -10,
                }}
                dotStyle={{
                  width: RFPercentage(2),
                  height: RFPercentage(2),
                  borderRadius: RFPercentage(1),
                  marginHorizontal: 4,
                  backgroundColor: colors.primaryCardColor,
                }}
                inactiveDotStyle={{
                  width: RFPercentage(2),
                  height: RFPercentage(2),
                  borderRadius: RFPercentage(1),
                  marginHorizontal: 4,
                  backgroundColor: '#f9c33c',
                }}
                inactiveDotOpacity={0.4}
                inactiveDotScale={0.8}
              />

              {accountCards.length === 1 && (
                <S.EmptyAccountAlert color={colors.alertColor}>
                  Cadastre uma conta para poder começar a organizar suas
                  finanças
                </S.EmptyAccountAlert>
              )}
            </>
          )}

          <S.BalanceContainer>
            <S.Balance>
              <S.BalanceText color={colors.primaryColor}>
                Saldo atual
              </S.BalanceText>
              {!loadingAllData() ? (
                <ContentLoader
                  viewBox={`0 0 116 32`}
                  height={32}
                  width={116}
                  style={{ marginTop: 16 }}
                  backgroundColor={colors.secondaryColor}
                  foregroundColor="rgb(255, 255, 255)">
                  <Rect x="0" y="0" rx="20" ry="20" width={116} height="32" />
                </ContentLoader>
              ) : (
                <S.BalanceValue color={colors.textColor}>
                  {getCurrencyFormat(totalCurrentBalance)}
                </S.BalanceValue>
              )}
            </S.Balance>

            <S.Balance style={{ opacity: 0.6 }}>
              <S.BalanceText color={colors.primaryColor}>
                Saldo previsto
              </S.BalanceText>
              {!loadingAllData() ? (
                <ContentLoader
                  viewBox={`0 0 116 32`}
                  height={32}
                  width={116}
                  style={{ marginTop: 16 }}
                  backgroundColor={colors.secondaryColor}
                  foregroundColor="rgb(255, 255, 255)">
                  <Rect x="0" y="0" rx="20" ry="20" width={116} height="32" />
                </ContentLoader>
              ) : (
                <S.BalanceValue color={colors.textColor}>
                  {getCurrencyFormat(totalEstimateBalance)}
                </S.BalanceValue>
              )}
            </S.Balance>
          </S.BalanceContainer>

          <S.Estimates>
            <S.BalanceText color={colors.primaryColor}>
              Estimativas
            </S.BalanceText>
            {!loadingAllData() ? (
              <ContentLoader
                viewBox={`0 0 ${width} 150`}
                height={150}
                width={'100%'}
                backgroundColor={colors.secondaryColor}
                foregroundColor="rgb(255, 255, 255)">
                <Rect x="0" y="0" rx="20" ry="20" width={width} height="150" />
              </ContentLoader>
            ) : (
              <Estimates />
            )}
          </S.Estimates>

          <S.LastTransactions>
            <S.BalanceText color={colors.primaryColor}>
              Últimas Transações
            </S.BalanceText>
            <LastTransactions />
          </S.LastTransactions>
        </S.Container>
      </ScrollView>
      <Menu />
    </>
  );
}
