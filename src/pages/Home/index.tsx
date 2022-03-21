import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Text, TouchableOpacity, Dimensions } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import * as S from './styles';
import Header from '../../components/Header';
import { Colors } from '../../styles/global';
import Menu from '../../components/Menu';
import Icon from 'react-native-vector-icons/Ionicons';

export default function Home() {
  const { user, signOut } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const controller = new AbortController();
  const width = Dimensions.get('screen').width;
  const primaryColor = Colors.BLUE_PRIMARY_LIGHTER;
  const secondaryColor = Colors.BLUE_SOFT_LIGHTER;

  const estimateColors = {
    month: Colors.MAIN_TEXT_LIGHTER,
    value: Colors.BLUE_SECONDARY_LIGHTER,
    indicator: Colors.ORANGE_SECONDARY_LIGHTER,
  };

  const getApiUsersExample = useCallback(async () => {
    try {
      const { data } = await api.get('users');
      setUsers(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    getApiUsersExample();

    return () => {
      controller.abort();
    };
  }, []);

  const cards = [
    {
      id: 1,
      title: 'Banco do Brasil',
      current_balance: 100000,
      estimate_balance: 80000,
    },
    {
      id: 2,
      title: 'Nubank',
      current_balance: 100000,
      estimate_balance: 80000,
    },
  ];

  const estimates = [
    {
      id: 1,
      month: 'Nov 20',
      value: 100000,
      indicator: 0,
    },
    {
      id: 2,
      month: 'Dez 20',
      value: 1000000,
      indicator: 20,
    },
    {
      id: 3,
      month: 'Jan 21',
      value: 1000000,
      indicator: 20,
    },
    {
      id: 4,
      month: 'Fev 21',
      value: 1000000,
      indicator: 20,
    },
    {
      id: 5,
      month: 'Mar 21',
      value: 2000000,
      indicator: 40,
    },
  ];

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Header />
        <S.Container>
          <ScrollView
            horizontal
            snapToInterval={width}
            decelerationRate="fast"
            showsHorizontalScrollIndicator={false}
            style={{
              height: 149,
            }}>
            {cards.map(card => (
              <S.AccountCardWrapper key={card.id}>
                <S.Card backgroundColor="#FF981E">
                  <S.CardInfo>
                    <S.CardTitle>{card.title}</S.CardTitle>
                    <S.CardBalance>R$ {card.current_balance}</S.CardBalance>
                    <S.CardSubBalance>
                      Previsto R$ {card.estimate_balance}
                    </S.CardSubBalance>
                  </S.CardInfo>

                  <S.IconContainer>
                    <Icon name="business" size={32} color="#FF981E" />
                  </S.IconContainer>
                </S.Card>
              </S.AccountCardWrapper>
            ))}
            <S.AccountCardWrapper>
              <S.Card backgroundColor="#FF981E">
                <S.AddCardContainer>
                  <S.CardTitle>Adicionar uma nova conta</S.CardTitle>
                  <S.AddButton>
                    <Icon name="add-circle" size={52} color="#fff" />
                  </S.AddButton>
                </S.AddCardContainer>
              </S.Card>
            </S.AccountCardWrapper>
          </ScrollView>

          <S.AccountDots>
            {cards.map(card => (
              <S.Dot key={card.id} active={card.id === 1} />
            ))}
          </S.AccountDots>

          <S.BalanceContainer>
            <S.Balance>
              <S.BalanceText color={primaryColor}>Saldo atual</S.BalanceText>
              <S.BalanceValue>R$ 0</S.BalanceValue>
            </S.Balance>

            <S.Balance>
              <S.BalanceText color={primaryColor}>Saldo previsto</S.BalanceText>
              <S.BalanceValue>R$ 0</S.BalanceValue>
            </S.Balance>
          </S.BalanceContainer>

          <S.Estimates>
            <S.BalanceText color={primaryColor}>Estimativas</S.BalanceText>
            <S.EstimateView backgroundColor={secondaryColor}>
              <ScrollView
                horizontal
                contentContainerStyle={{
                  minWidth: '100%',
                  alignItems: 'flex-end',
                  justifyContent: 'center',
                }}
                showsHorizontalScrollIndicator={false}>
                {estimates.map(estimate => (
                  <S.EstimateInMonth key={estimate.id}>
                    <S.EstimateMonthText monthTextColor={estimateColors.month}>
                      {estimate.month}
                    </S.EstimateMonthText>
                    <S.EstimateMonthValue valueTextColor={estimateColors.value}>
                      R$ {estimate.value}
                    </S.EstimateMonthValue>

                    <S.EstimateIndicator
                      indicatorVelue={estimate.indicator}
                      indicatorColor={estimateColors.indicator}
                    />
                  </S.EstimateInMonth>
                ))}
              </ScrollView>
            </S.EstimateView>
          </S.Estimates>

          <S.LastTransactions>
            <S.BalanceText color={primaryColor}>
              Últimas Transações
            </S.BalanceText>

            <S.LastTransactionsView backgroundColor={secondaryColor}>
              <S.TransactionText>
                Nenhuma transação por enquanto
              </S.TransactionText>
            </S.LastTransactionsView>
            <S.LastTransactionsView backgroundColor={secondaryColor}>
              <Icon name="business" size={32} color="#2673CE" />
              <S.TitleContainer>
                <S.TransactionTitle>
                  {'Compras do mês'.substring(0, 16)}
                </S.TransactionTitle>
              </S.TitleContainer>

              <S.DetailsContainer>
                <S.TransactionValue color="#CC3728">
                  R$ 585,90
                </S.TransactionValue>
                <S.TransactionDate>07 Jan</S.TransactionDate>
              </S.DetailsContainer>
            </S.LastTransactionsView>
          </S.LastTransactions>
          {/*   <TouchableOpacity onPress={() => signOut()}>
            <Text>SAIR</Text>
          </TouchableOpacity> */}
        </S.Container>
      </ScrollView>
      <Menu />
    </>
  );
}
