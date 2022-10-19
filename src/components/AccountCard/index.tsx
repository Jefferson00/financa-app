import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { Dimensions, ScrollView } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/Ionicons';
import { Nav } from '../../routes';
import { useAccount } from '../../hooks/AccountContext';
import { Card } from './Card';
import { useState } from 'react';
import ContentLoader, { Rect } from 'react-content-loader/native';
import { useTheme } from '../../hooks/ThemeContext';
import { colors } from '../../styles/colors';

export function AccountCard() {
  const { accountCards, loadingCards } = useAccount();
  const { theme } = useTheme();
  const navigation = useNavigation<Nav>();

  const primaryColors = ['#FF981E', '#F9C33C'];
  const secondColors = ['#0070BA', '#1546A0'];
  const [cardIndex, setCardIndex] = useState(0);
  const width = Dimensions.get('screen').width;

  const handleChangeColors = (xValue: number) => {
    const indicator = width / 2;
    const index = xValue / indicator;
    setCardIndex(Math.floor(index) + 1);
  };

  const loadingColors = () => {
    if (theme === 'dark') {
      return {
        background: colors.dark[700],
        foreground: colors.gray[600],
      };
    }
    return {
      background: colors.orange[500],
      foreground: colors.white,
    };
  };

  return (
    <ScrollView
      horizontal
      onScroll={({ nativeEvent }) =>
        handleChangeColors(nativeEvent.contentOffset.x)
      }
      showsHorizontalScrollIndicator={false}
      style={{
        marginTop: RFPercentage(6),
      }}
      contentContainerStyle={{
        paddingHorizontal: 32,
      }}>
      {loadingCards && (
        <ContentLoader
          viewBox={`0 0 223 150`}
          height={150}
          width={223}
          backgroundColor={loadingColors().background}
          foregroundColor={loadingColors().foreground}>
          <Rect x="0" y="0" rx="8" ry="8" width="223" height="150" />
        </ContentLoader>
      )}

      {!loadingCards &&
        accountCards.map((item, index) => (
          <Card
            colors={
              cardIndex === index + 1 || index === 0
                ? primaryColors
                : secondColors
            }
            item={item}
            icon={() => (
              <Icon
                name="business"
                size={RFPercentage(2.5)}
                color={
                  cardIndex === index + 1 || index === 0 ? '#FF981E' : '#1546A0'
                }
              />
            )}
            key={String(Math.random())}
            handleNavigate={() =>
              navigation.navigate('Account', {
                account: item.isDefault ? null : item.account,
              })
            }
          />
        ))}
    </ScrollView>
  );
}
