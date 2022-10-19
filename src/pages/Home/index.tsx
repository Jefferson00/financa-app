import React, { useEffect, useState } from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useDispatch, useSelector } from 'react-redux';
import { Header } from '../../components/NewHeader';
import { LastTransactions } from '../../components/LastTransactions';
import { Estimates } from '../../components/Estimates';
import { useAuth } from '../../hooks/AuthContext';
import { listAccounts } from '../../store/modules/Accounts/fetchActions';

import * as S from './styles';
import Menu from '../../components/Menu';

import {
  listExpanses,
  listExpansesOnAccount,
} from '../../store/modules/Expanses/fetchActions';
import {
  listIncomes,
  listIncomesOnAccount,
} from '../../store/modules/Incomes/fetchActions';
import { listCreditCards } from '../../store/modules/CreditCards/fetchActions';
import Animated, {
  useSharedValue,
  useAnimatedScrollHandler,
} from 'react-native-reanimated';
import { AccountCard } from '../../components/AccountCard';
import { useAccount } from '../../hooks/AccountContext';
import { useTheme } from '../../hooks/ThemeContext';
import { colors } from '../../styles/colors';
import { useDate } from '../../hooks/DateContext';
import State from '../../interfaces/State';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native';

export default function Home() {
  const { isFocused } = useNavigation();
  const dispatch = useDispatch<any>();
  const { selectedDate, setCurrentMonth } = useDate();
  const { accounts } = useSelector((state: State) => state.accounts);
  const { incomes, incomesOnAccount } = useSelector(
    (state: State) => state.incomes,
  );
  const { expanses, expansesOnAccount } = useSelector(
    (state: State) => state.expanses,
  );

  const { user } = useAuth();
  const { theme } = useTheme();
  const {
    listAccountCards,
    totalEstimateBalance,
    totalCurrentBalance,
    loadingCards,
  } = useAccount();

  const [refreshing, setRefreshing] = useState(false);

  const headerValue = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler(event => {
    headerValue.value = event.contentOffset.y;
  });

  const wait = (timeout: number) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  };

  const onRefresh = () => {
    setRefreshing(true);
    setCurrentMonth();
    wait(2000).then(() => setRefreshing(false));
  };

  const headerColors = () => {
    if (theme === 'dark') {
      return [colors.dark[800], colors.dark[800]];
    }
    return [colors.blue[600], colors.blue[700]];
  };

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
    if (isFocused()) {
      listAccountCards();
    }
  }, [selectedDate, accounts, incomes, expanses]);

  return (
    <>
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            progressViewOffset={RFPercentage(36)}
            onRefresh={onRefresh}
          />
        }
        contentContainerStyle={{
          minHeight: RFPercentage(100),
          paddingTop: RFPercentage(40),
        }}
        onScroll={scrollHandler}>
        <S.Container>
          <AccountCard />

          <Estimates />

          <LastTransactions />
        </S.Container>
      </Animated.ScrollView>
      <Header
        headerValue={headerValue}
        colors={headerColors()}
        titles={{
          current: 'Saldo atual',
          estimate: 'Saldo previsto',
        }}
        values={{
          current: totalCurrentBalance,
          estimate: totalEstimateBalance,
        }}
      />
      <Menu />
    </>
  );
}
