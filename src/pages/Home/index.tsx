import React, { useEffect, useState } from 'react';
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

export default function Home() {
  const navigation = useNavigation<Nav>();
  const {
    isLoadingData,
    isLoadingCards,
    accountCards,
    totalCurrentBalance,
    totalEstimateBalance,
  } = useAccount();
  const { theme } = useTheme();
  const width = Dimensions.get('screen').width;

  const [activeSlide, setActiveSlide] = useState(0);

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

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Header />
        <S.Container>
          {(isLoadingData || isLoadingCards) && (
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
          {!isLoadingData && !isLoadingCards && (
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
              {isLoadingData ? (
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
              {isLoadingData ? (
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
            {isLoadingData ? (
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
