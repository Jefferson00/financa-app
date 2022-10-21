import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nav } from '../../routes';
import { IAccountCard, useAccount } from '../../hooks/AccountContext';
import { Card } from './Card';
import { useState } from 'react';
import { useTheme } from '../../hooks/ThemeContext';
import { accountCardColors } from './styles';
import { Loader } from './Loader';
import * as S from './styles';

export function AccountCard() {
  const width = Dimensions.get('screen').width;
  const navigation = useNavigation<Nav>();
  const { accountCards, loadingCards } = useAccount();
  const { theme } = useTheme();
  const [cardIndex, setCardIndex] = useState(0);

  const colors = accountCardColors(theme);

  const handleChangeColors = (xValue: number) => {
    const indicator = width / 2;
    const index = xValue / indicator;
    setCardIndex(Math.floor(index) + 1);
  };

  const getCardGradientColors = (index: number) => {
    if (cardIndex === index + 1 || index === 0) {
      return colors.card.primary;
    }
    return colors.card.secondary;
  };

  const getCardIcon = (index: number) => {
    const iconColor =
      cardIndex === index + 1 || index === 0
        ? colors.card.icon.primary
        : colors.card.icon.secondary;
    return () => (
      <Icon name="business" size={RFPercentage(2.5)} color={iconColor} />
    );
  };

  const handleNavigate = (item: IAccountCard) => {
    navigation.navigate('Account', {
      account: item.isDefault ? null : item.account,
    });
  };

  return (
    <S.ScrollView
      horizontal
      onScroll={({ nativeEvent }) =>
        handleChangeColors(nativeEvent.contentOffset.x)
      }
      showsHorizontalScrollIndicator={false}>
      {loadingCards && <Loader />}

      {!loadingCards &&
        accountCards.map((item, index) => (
          <Card
            key={String(Math.random())}
            colors={getCardGradientColors(index)}
            item={item}
            icon={getCardIcon(index)}
            handleNavigate={() => handleNavigate(item)}
          />
        ))}
    </S.ScrollView>
  );
}
