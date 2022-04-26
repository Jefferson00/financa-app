import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Dimensions } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import * as S from './styles';
import Header from '../../components/Header';
import { Colors } from '../../styles/global';
import Menu from '../../components/Menu';
import Icon from 'react-native-vector-icons/Ionicons';
import Card from '../../components/Card';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect } from 'react-content-loader/native';
import Estimates from './components/Estimates';
import LastTransactions from './components/LastTransactions';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../routes';

export default function Home() {
  const navigation = useNavigation<Nav>();
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const [accounts, setAccounts] = useState<any[]>([]);
  const [cards, setCards] = useState<any[]>([]);
  const controller = new AbortController();
  const width = Dimensions.get('screen').width;
  const primaryColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const secondaryColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const primaryCardColor =
    theme === 'dark'
      ? Colors.ORANGE_PRIMARY_DARKER
      : Colors.ORANGE_PRIMARY_LIGHTER;
  const secondaryCardColor =
    theme === 'dark'
      ? Colors.ORANGE_SECONDARY_DARKER
      : Colors.ORANGE_SECONDARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;

  const [activeSlide, setActiveSlide] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const getUserAccounts = useCallback(async () => {
    if (user) {
      try {
        const { data } = await api.get(`accounts/user/${user.id}`);
        setAccounts(data);
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  useEffect(() => {
    getUserAccounts().finally(() => setIsLoading(false));

    return () => {
      controller.abort();
    };
  }, []);

  useEffect(() => {
    const cardsArray: any[] = [];
    accounts.map((account, index) => {
      cardsArray.push({
        id: index + 1,
        title: account.name,
        type: account.type,
        current_balance: 0,
        estimate_balance: 0,
        account,
      });
    });
    cardsArray.push({
      id: accounts.length + 1,
      title: 'Adicionar uma nova conta',
      type: 'ADD',
      current_balance: 0,
      estimate_balance: 0,
    });
    setCards(cardsArray);
    console.log('carregou os cartões');
  }, [accounts]);

  return (
    <>
      <ScrollView
        style={{
          flex: 1,
        }}
        showsVerticalScrollIndicator={false}>
        <Header />
        <S.Container>
          {isLoading && (
            <ContentLoader
              viewBox="0 0 269 140"
              height={140}
              style={{
                marginBottom: 32,
              }}
              backgroundColor={secondaryCardColor}
              foregroundColor="rgb(255, 255, 255)">
              <Rect x="0" y="0" rx="20" ry="20" width="269" height="140" />
            </ContentLoader>
          )}
          {!isLoading && (
            <>
              <Carousel
                data={cards}
                onSnapToItem={index => setActiveSlide(index)}
                sliderWidth={width}
                itemWidth={width}
                itemHeight={149}
                renderItem={({ item }) => (
                  <Card
                    id={String(item.id)}
                    colors={{
                      PRIMARY_BACKGROUND: primaryCardColor,
                      SECOND_BACKGROUND: secondaryCardColor,
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
                            color={secondaryCardColor}
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
                dotsLength={cards.length}
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
                  backgroundColor: primaryCardColor,
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
            </>
          )}

          <S.BalanceContainer>
            <S.Balance>
              <S.BalanceText color={primaryColor}>Saldo atual</S.BalanceText>
              {isLoading ? (
                <ContentLoader
                  viewBox={`0 0 116 32`}
                  height={32}
                  width={116}
                  style={{ marginTop: 16 }}
                  backgroundColor={secondaryColor}
                  foregroundColor="rgb(255, 255, 255)">
                  <Rect x="0" y="0" rx="20" ry="20" width={116} height="32" />
                </ContentLoader>
              ) : (
                <S.BalanceValue color={textColor}>
                  {getCurrencyFormat(0)}
                </S.BalanceValue>
              )}
            </S.Balance>

            <S.Balance>
              <S.BalanceText color={primaryColor}>Saldo previsto</S.BalanceText>
              {isLoading ? (
                <ContentLoader
                  viewBox={`0 0 116 32`}
                  height={32}
                  width={116}
                  style={{ marginTop: 16 }}
                  backgroundColor={secondaryColor}
                  foregroundColor="rgb(255, 255, 255)">
                  <Rect x="0" y="0" rx="20" ry="20" width={116} height="32" />
                </ContentLoader>
              ) : (
                <S.BalanceValue color={textColor}>
                  {getCurrencyFormat(0)}
                </S.BalanceValue>
              )}
            </S.Balance>
          </S.BalanceContainer>

          <S.Estimates>
            <S.BalanceText color={primaryColor}>Estimativas</S.BalanceText>
            {isLoading ? (
              <ContentLoader
                viewBox={`0 0 ${width} 150`}
                height={150}
                width={'100%'}
                backgroundColor={secondaryColor}
                foregroundColor="rgb(255, 255, 255)">
                <Rect x="0" y="0" rx="20" ry="20" width={width} height="150" />
              </ContentLoader>
            ) : (
              <Estimates />
            )}
          </S.Estimates>

          <S.LastTransactions>
            <S.BalanceText color={primaryColor}>
              Últimas Transações
            </S.BalanceText>
            {isLoading ? (
              <ContentLoader
                viewBox={`0 0 ${width} 80`}
                height={80}
                width={'100%'}
                backgroundColor={secondaryColor}
                foregroundColor="rgb(255, 255, 255)">
                <Rect x="0" y="0" rx="20" ry="20" width={width} height="80" />
              </ContentLoader>
            ) : (
              <LastTransactions />
            )}
          </S.LastTransactions>
        </S.Container>
      </ScrollView>
      <Menu />
    </>
  );
}
