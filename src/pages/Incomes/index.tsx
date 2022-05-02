import React, { useCallback, useEffect, useState } from 'react';
import { ScrollView, Dimensions, Text, View } from 'react-native';
import api from '../../services/api';
import { useAuth } from '../../hooks/AuthContext';
import { useAccount } from '../../hooks/AccountContext';
import { useDate } from '../../hooks/DateContext';
import * as S from './styles';
import Header from '../../components/Header';
import { Colors } from '../../styles/global';
import Menu from '../../components/Menu';
import Icon from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import Card from '../../components/Card';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { useNavigation } from '@react-navigation/native';
import { Nav } from '../../routes';
import { Account } from '../../interfaces/Account';
import Button from '../../components/Button';
import ItemCard from '../../components/ItemCard';
import { Income } from '../../interfaces/Income';
import { getEstimateIncomes } from '../../utils/getCurrentBalance';
import { getMonth } from 'date-fns';
import { getMonthName } from '../../utils/dateFormats';

export default function Incomes() {
  const navigation = useNavigation<Nav>();
  const { incomes, isLoadingData } = useAccount();
  const { selectedDate } = useDate();
  const { theme } = useTheme();
  const [incomesByDate, setIncomesByDate] = useState<
    { day: number; incomes: Income[] }[]
  >([]);
  const width = Dimensions.get('screen').width;

  const PlusIcon = () => {
    return <Icon name="add" size={RFPercentage(6)} color="#fff" />;
  };

  const MoneyIcon = () => {
    return (
      <MaterialIcon
        name="attach-money"
        size={RFPercentage(6)}
        color={primaryColor}
      />
    );
  };

  const primaryColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;
  const secondaryColor =
    theme === 'dark'
      ? Colors.INCOME_SECONDARY_DARKER
      : Colors.INCOME_SECONDARY_LIGTHER;
  const primaryCardColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;
  const secondaryCardColor =
    theme === 'dark'
      ? Colors.INCOME_SECONDARY_DARKER
      : Colors.INCOME_SECONDARY_LIGTHER;

  const secondaryCardLoader =
    theme === 'dark' ? Colors.INCOME_SOFT_DARKER : Colors.INCOME_SOFT_LIGTHER;
  const titleColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;
  const dateTitleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const alertColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;

  const buttonColors = {
    PRIMARY_BACKGROUND: primaryColor,
    SECOND_BACKGROUND: secondaryColor,
    TEXT: '#fff',
  };

  useEffect(() => {
    const incomesOrdered = incomes.sort(
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
    incomesOrderedByDay.map(item => {
      item.incomes = incomes.filter(
        income => new Date(income.receiptDate).getDate() === item.day,
      );
    });
    setIncomesByDate(incomesOrderedByDay);
    console.log('newwww', incomesOrderedByDay[0]);
  }, [incomes]);

  return (
    <>
      <Header />
      <S.Container>
        {isLoadingData && (
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
        {!isLoadingData && (
          <>
            <Card
              id={'income'}
              colors={{
                PRIMARY_BACKGROUND: primaryCardColor,
                SECOND_BACKGROUND: secondaryCardColor,
              }}
              icon={() => (
                <Icon
                  name="arrow-down"
                  size={RFPercentage(5)}
                  color={primaryColor}
                />
              )}
              title="Entradas"
              values={{
                current: 0,
                estimate: getEstimateIncomes(incomes),
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
          color={titleColor}
        />
        <S.IncomesTitleText color={titleColor}>Entradas</S.IncomesTitleText>
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

      {/* <S.IncomesList
        data={incomes}
        contentContainerStyle={{
          width: '100%',
        }}
        renderItem={({ item }) => (
          <ItemCard icon={PlusIcon} title={item?.name} />
        )}></S.IncomesList> */}

      {isLoadingData ? (
        <ContentLoader
          viewBox="0 0 327 100"
          height={100}
          style={{
            marginTop: 32,
          }}
          backgroundColor={secondaryCardLoader}
          foregroundColor="rgb(255, 255, 255)">
          <Rect x="0" y="0" rx="20" ry="20" width="327" height="100" />
        </ContentLoader>
      ) : (
        <ScrollView
          style={{
            paddingBottom: RFPercentage(15),
            height: '100%',
            flex: 1,
          }}
          contentContainerStyle={{
            flex: 1,
            paddingHorizontal: RFPercentage(3.2),
            paddingBottom: RFPercentage(15),
            height: '100%',
          }}>
          {incomes.length > 0 &&
            incomesByDate.map(item => (
              <View key={item.day} style={{ marginVertical: RFPercentage(3) }}>
                <S.DateTitle color={dateTitleColor}>
                  {item.day} de {getMonthName(selectedDate)}
                </S.DateTitle>

                {item.incomes.map(income => (
                  <ItemCard
                    key={income.id}
                    icon={MoneyIcon}
                    title={income?.name}
                    value={income.value}
                    mainColor={primaryColor}
                  />
                ))}
              </View>
            ))}

          {incomes.length === 0 && (
            <S.Empty>
              <Icon
                name="close-circle"
                size={RFPercentage(4)}
                color={primaryColor}
              />
              <S.EmptyText color={textColor}>
                Nenhuma entrada nesse mês
              </S.EmptyText>
            </S.Empty>
          )}
        </ScrollView>
      )}

      <Menu />
    </>
  );
}
