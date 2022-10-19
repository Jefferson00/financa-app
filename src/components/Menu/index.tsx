import React, { useCallback, useEffect, useMemo, useState } from 'react';
import * as S from './styles';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  useDerivedValue,
  interpolateColor,
  SharedValue,
} from 'react-native-reanimated';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Nav } from '../../routes';
import { useTheme } from '../../hooks/ThemeContext';
import { RFPercentage } from 'react-native-responsive-fontsize';
import ModalComponent from '../Modal';
import { useSelector } from 'react-redux';
import State from '../../interfaces/State';
import { useNotification } from '../../hooks/NotificationContext';
import { colors } from '../../styles/colors';

export default function Menu() {
  const navigation = useNavigation<Nav>();
  const routes = useRoute();
  const routeName = routes.name;
  const { theme } = useTheme();
  const { lateItems, nextDaysItems } = useNotification();

  const { accounts } = useSelector((state: State) => state.accounts);
  const [hasAccount, setHasAccount] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const hasNotifications = useMemo(() => {
    return nextDaysItems.length > 0 || lateItems.length > 0;
  }, [nextDaysItems, lateItems]);

  const progress = useDerivedValue(() => {
    return theme === 'dark'
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [theme]);

  const buttonHomeAnimate = useSharedValue(0);
  const buttonIncomeAnimate = useSharedValue(0);
  const buttonExpanseAnimate = useSharedValue(0);
  const buttonNotificationsAnimate = useSharedValue(0);

  const buttonHomeAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(buttonHomeAnimate.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const buttonIncomeAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(buttonIncomeAnimate.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const buttonExpanseAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(buttonExpanseAnimate.value, [0, 1], [1, 0.8]),
        },
      ],
    };
  });

  const buttonNotificationsAnimated = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: interpolate(
            buttonNotificationsAnimate.value,
            [0, 1],
            [1, 0.8],
          ),
        },
      ],
    };
  });

  const colorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#262626'],
    );

    const borderColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#d2d2d2', '#262626'],
    );

    return { backgroundColor, borderColor };
  });

  const handleClickButton = useCallback(
    (buttonAnimate: SharedValue<number>, route: string) => {
      buttonAnimate.value = withTiming(0);
      if (hasAccount || route === 'Home') {
        navigation.navigate(route);
      } else {
        setAlertModalVisible(true);
      }
    },
    [hasAccount],
  );

  const menuColors = () => {
    if (theme === 'dark') {
      return {
        background: colors.dark[800],
        border: colors.dark[800],
        active: colors.blue[200],
        inactive: colors.dark[700],
      };
    }
    return {
      background: colors.white,
      border: colors.blue[200],
      active: colors.blue[600],
      inactive: colors.blue[300],
    };
  };

  useEffect(() => {
    if (accounts.length > 0) {
      setHasAccount(true);
    } else {
      setHasAccount(false);
    }
  }, [accounts]);

  return (
    <>
      <S.Container
        style={[
          {
            borderWidth: 1,
            borderColor: menuColors().border,
          },
          colorAnimated,
        ]}>
        <S.MenuView>
          <S.MenuButton
            hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}
            onPressIn={() => (buttonHomeAnimate.value = withTiming(1))}
            onPressOut={() => {
              handleClickButton(buttonHomeAnimate, 'Home');
            }}>
            <S.AnimatedView style={buttonHomeAnimated}>
              <Icon
                name="home"
                size={RFPercentage(5.2)}
                color={
                  routeName === 'Home'
                    ? menuColors().active
                    : menuColors().inactive
                }
              />
            </S.AnimatedView>
          </S.MenuButton>
        </S.MenuView>

        <S.MenuView>
          <S.MenuButton
            hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}
            onPressIn={() => (buttonIncomeAnimate.value = withTiming(1))}
            onPressOut={() =>
              handleClickButton(buttonIncomeAnimate, 'Incomes')
            }>
            <S.AnimatedView style={buttonIncomeAnimated}>
              <Icon
                name="arrow-up-circle"
                size={RFPercentage(5.2)}
                color={
                  routeName === 'Incomes' || routeName === 'CreateIncome'
                    ? menuColors().active
                    : menuColors().inactive
                }
              />
            </S.AnimatedView>
          </S.MenuButton>
        </S.MenuView>

        <S.MenuView>
          <S.MenuButton
            hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}
            onPressIn={() => (buttonExpanseAnimate.value = withTiming(1))}
            onPressOut={() =>
              handleClickButton(buttonExpanseAnimate, 'Expanses')
            }>
            <S.AnimatedView style={buttonExpanseAnimated}>
              <Icon
                name="arrow-down-circle"
                size={RFPercentage(5.2)}
                color={
                  routeName === 'Expanses' || routeName === 'CreateExpanse'
                    ? menuColors().active
                    : menuColors().inactive
                }
              />
            </S.AnimatedView>
          </S.MenuButton>
        </S.MenuView>

        <S.MenuView>
          <S.MenuButton
            hitSlop={{ top: 6, left: 6, right: 6, bottom: 6 }}
            onPressIn={() => (buttonNotificationsAnimate.value = withTiming(1))}
            onPressOut={() =>
              handleClickButton(buttonNotificationsAnimate, 'Notifications')
            }>
            <S.AnimatedView style={buttonNotificationsAnimated}>
              <Icon
                name="notifications"
                size={RFPercentage(5.2)}
                color={
                  routeName === 'Notifications'
                    ? menuColors().active
                    : menuColors().inactive
                }
              />
            </S.AnimatedView>
          </S.MenuButton>
          {hasNotifications && (
            <S.Dot style={{ backgroundColor: menuColors().active }} />
          )}
        </S.MenuView>
      </S.Container>

      <ModalComponent
        type="info"
        visible={alertModalVisible}
        title="Cadastre uma conta para usar essa função"
        onSucessOkButton={() => setAlertModalVisible(false)}
        animationType="slide"
        transparent
        handleCancel={() => setAlertModalVisible(false)}
        theme={theme}
      />
    </>
  );
}
