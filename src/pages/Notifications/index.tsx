import React from 'react';
import { ScrollView, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SharedElement } from 'react-navigation-shared-element';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RFPercentage } from 'react-native-responsive-fontsize';

import { useAuth } from '../../hooks/AuthContext';
import { useTheme } from '../../hooks/ThemeContext';

import Menu from '../../components/Menu';

import * as S from './styles';
import { Nav } from '../../routes';
import { maskPhone } from '../../utils/masks';
import { getProfileColors } from '../../utils/colors/profile';
import Header from '../../components/Header';
import { Colors } from '../../styles/global';
import { useNotification } from '../../hooks/NotificationContext';
import { getFullDayOfTheMounth } from '../../utils/dateFormats';
import { getCurrencyFormat } from '../../utils/getCurrencyFormat';

export default function Notifications() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { lateItems, nextDaysItems } = useNotification();
  const navigation = useNavigation<Nav>();
  const lateDaysState: number[] = [];
  const nextDaysState: number[] = [];

  const backgroundColor =
    theme === 'dark' ? Colors.BACKGROUND_DARKER : Colors.BACKGROUND_LIGTHER;
  const titleColor = theme === 'dark' ? '#4876AC' : '#2673CE';
  const red = theme === 'dark' ? '#AB5249' : '#CC3728';
  const redBackground = theme === 'dark' ? '#AB5249' : '#F3E6E5';
  const green = theme === 'dark' ? '#1A8289' : '#1A8289';
  const greenBackground = theme === 'dark' ? '#1A8289' : '#C7DDE1';
  const emptyBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container backgroundColor={backgroundColor}>
        <ScrollView
          style={{ width: '100%', padding: 24 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 150,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <S.Title color={titleColor}>Notificações</S.Title>

          <S.RemindView>
            <S.Header>
              <Icon
                name="exclamation-circle"
                color={red}
                size={30}
                style={{
                  marginRight: 8,
                }}
              />
              <S.Title color={red}>Atrasados</S.Title>
            </S.Header>

            {lateItems.length === 0 && (
              <S.Item
                style={{ marginTop: 32, justifyContent: 'center' }}
                backgroundColor={emptyBackground}
                borderColor={titleColor}>
                <S.Text>Nada por enquanto</S.Text>
              </S.Item>
            )}

            {lateItems.map((item, index) => {
              lateDaysState.push(new Date(item.receiptDate).getDate());
              return (
                <View key={index}>
                  {lateDaysState.filter(
                    ltd => ltd === new Date(item.receiptDate).getDate(),
                  ).length <= 1 && (
                    <S.DateText>
                      {getFullDayOfTheMounth(new Date(item.receiptDate))}
                    </S.DateText>
                  )}
                  <TouchableOpacity
                    onPress={() =>
                      navigation.navigate(
                        item.type === 'EXPANSE' ? 'Expanses' : 'Incomes',
                      )
                    }>
                    <S.Item
                      backgroundColor={
                        item.type === 'EXPANSE'
                          ? redBackground
                          : greenBackground
                      }
                      borderColor={item.type === 'EXPANSE' ? red : green}>
                      <S.ItemTitle>
                        <Icon
                          name="dollar"
                          size={24}
                          color={
                            item.type === 'EXPANSE'
                              ? Colors.EXPANSE_PRIMARY_LIGTHER
                              : Colors.INCOME_PRIMARY_LIGTHER
                          }
                          style={{
                            marginRight: 16,
                          }}
                        />

                        <S.Text>{item.name}</S.Text>
                      </S.ItemTitle>

                      <S.Text>{getCurrencyFormat(item.value)}</S.Text>
                    </S.Item>
                  </TouchableOpacity>
                </View>
              );
            })}
          </S.RemindView>

          <S.RemindView>
            <S.Header>
              <Icon
                name="calendar"
                color={titleColor}
                size={30}
                style={{
                  marginRight: 8,
                }}
              />
              <S.Title color={titleColor}>Nos próximos dias</S.Title>
            </S.Header>

            {nextDaysItems.length === 0 && (
              <S.Item
                style={{ marginTop: 32, justifyContent: 'center' }}
                backgroundColor={emptyBackground}
                borderColor={titleColor}>
                <S.Text>Nada por enquanto</S.Text>
              </S.Item>
            )}

            {nextDaysItems.map((item, index) => {
              return (
                <View key={index}>
                  <S.DateText>{getFullDayOfTheMounth(item.day)}</S.DateText>
                  {item.items.map((i, index) => {
                    return (
                      <TouchableOpacity
                        key={index}
                        onPress={() =>
                          navigation.navigate(
                            i.type === 'EXPANSE' ? 'Expanses' : 'Incomes',
                          )
                        }>
                        <S.Item
                          backgroundColor={i.type === 'EXPANSE' ? red : green}
                          borderColor={i.type === 'EXPANSE' ? red : green}>
                          <View>
                            <Icon
                              name="dollar"
                              size={24}
                              color={
                                i.type === 'EXPANSE'
                                  ? Colors.EXPANSE_PRIMARY_LIGTHER
                                  : Colors.INCOME_PRIMARY_LIGTHER
                              }
                            />

                            <S.Text>{i.name}</S.Text>
                          </View>

                          <S.Text>{getCurrencyFormat(i.value)}</S.Text>
                        </S.Item>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              );
            })}
          </S.RemindView>
        </ScrollView>
        <Menu />
      </S.Container>
    </>
  );
}
