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
import { ReducedHeader } from '../../components/NewHeader/ReducedHeader';
import { colors } from '../../styles/colors';
import { getCategoryIcon } from '../../utils/getCategoryIcon';

export default function Notifications() {
  const { user, signOut } = useAuth();
  const { theme } = useTheme();
  const { lateItems, nextDaysItems } = useNotification();
  const navigation = useNavigation<Nav>();
  const lateDaysState: number[] = [];
  const nextDaysState: number[] = [];

  const backgroundColor =
    theme === 'dark' ? Colors.BACKGROUND_DARKER : Colors.BACKGROUND_LIGTHER;

  const notificationsColor = () => {
    if (theme === 'dark') {
      return {
        text: {
          title: colors.blue[100],
          subtitle: colors.blue[100],
        },
        icon: {
          primary: colors.blue[100],
          secondary: colors.dark[700],
        },
        expanse: {
          primary: colors.red.dark[500],
          secondary: colors.dark[700],
        },
        income: {
          primary: colors.green.dark[500],
          secondary: colors.dark[700],
        },
        default: {
          primary: colors.blue.dark[500],
          secondary: colors.dark[700],
        },
      };
    } else {
      return {
        text: {
          title: colors.gray[600],
          subtitle: colors.gray[300],
        },
        icon: {
          primary: colors.blue[600],
          secondary: colors.blue[200],
        },
        expanse: {
          primary: colors.red[500],
          secondary: colors.red[100],
        },
        income: {
          primary: colors.green[500],
          secondary: colors.green[100],
        },
        default: {
          primary: colors.blue[500],
          secondary: colors.blue[100],
        },
      };
    }
  };

  const showDate = (item: any) => {
    return (
      lateDaysState.filter(ltd => ltd === new Date(item.receiptDate).getDate())
        .length <= 1
    );
  };

  return (
    <>
      <ReducedHeader title="Notificações" />
      <S.Container backgroundColor={backgroundColor}>
        <ScrollView
          style={{ width: '100%', padding: RFPercentage(3.4) }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: RFPercentage(20),
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <S.RemindView>
            <S.Header>
              <S.IconContainer
                backgroundColor={notificationsColor().icon.secondary}>
                <Icon
                  name="exclamation"
                  color={notificationsColor().icon.primary}
                  size={RFPercentage(2.5)}
                />
              </S.IconContainer>
              <S.Text
                color={notificationsColor().text.title}
                fontSize={2.3}
                fontWeight="SemiBold">
                Atrasados
              </S.Text>
            </S.Header>

            {lateItems.length === 0 && (
              <S.Item
                style={{ justifyContent: 'center' }}
                backgroundColor={notificationsColor().default.secondary}
                borderColor={notificationsColor().default.primary}>
                <S.Text>Nada por enquanto</S.Text>
              </S.Item>
            )}

            {lateItems.map((item, index) => {
              lateDaysState.push(new Date(item.receiptDate).getDate());
              return (
                <View key={index}>
                  {showDate(item) && (
                    <S.Text
                      color={notificationsColor().text.title}
                      style={{ marginBottom: RFPercentage(2) }}>
                      {getFullDayOfTheMounth(new Date(item.receiptDate))}
                    </S.Text>
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
                          ? notificationsColor().expanse.secondary
                          : notificationsColor().income.secondary
                      }
                      borderColor={
                        item.type === 'EXPANSE'
                          ? notificationsColor().expanse.primary
                          : notificationsColor().income.primary
                      }>
                      <S.ItemTitle>
                        {getCategoryIcon(
                          item.category,
                          notificationsColor().text.title,
                          RFPercentage(3.2),
                        )}

                        <S.Text
                          color={notificationsColor().text.title}
                          style={{ marginLeft: RFPercentage(1.3) }}>
                          {item.name}
                        </S.Text>
                      </S.ItemTitle>

                      <S.Text
                        fontWeight="SemiBold"
                        color={
                          item.type === 'EXPANSE'
                            ? notificationsColor().expanse.primary
                            : notificationsColor().income.primary
                        }>
                        {getCurrencyFormat(item.value)}
                      </S.Text>
                    </S.Item>
                  </TouchableOpacity>
                </View>
              );
            })}
          </S.RemindView>

          <S.RemindView>
            <S.Header>
              <S.IconContainer
                backgroundColor={notificationsColor().icon.secondary}>
                <Icon
                  name="calendar"
                  color={notificationsColor().icon.primary}
                  size={RFPercentage(2.5)}
                />
              </S.IconContainer>
              <S.Text
                color={notificationsColor().text.title}
                fontSize={2.3}
                fontWeight="SemiBold">
                Nos próximos dias
              </S.Text>
            </S.Header>

            {nextDaysItems.length === 0 && (
              <S.Item
                style={{ justifyContent: 'center' }}
                backgroundColor={notificationsColor().default.secondary}
                borderColor={notificationsColor().default.primary}>
                <S.Text>Nada por enquanto</S.Text>
              </S.Item>
            )}

            {nextDaysItems.map((item, index) => {
              return (
                <View key={index}>
                  <S.Text style={{ marginBottom: RFPercentage(2) }}>
                    {getFullDayOfTheMounth(item.day)}
                  </S.Text>
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
                          backgroundColor={
                            i.type === 'EXPANSE'
                              ? notificationsColor().expanse.secondary
                              : notificationsColor().income.secondary
                          }
                          borderColor={
                            i.type === 'EXPANSE'
                              ? notificationsColor().expanse.primary
                              : notificationsColor().income.primary
                          }>
                          <S.ItemTitle>
                            {getCategoryIcon(
                              i.category,
                              notificationsColor().text.title,
                              RFPercentage(3.2),
                            )}
                            <S.Text
                              color={notificationsColor().text.title}
                              style={{ marginLeft: RFPercentage(1.3) }}>
                              {i.name}
                            </S.Text>
                          </S.ItemTitle>

                          <S.Text
                            fontWeight="SemiBold"
                            color={
                              i.type === 'EXPANSE'
                                ? notificationsColor().expanse.primary
                                : notificationsColor().income.primary
                            }>
                            {getCurrencyFormat(i.value)}
                          </S.Text>
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
