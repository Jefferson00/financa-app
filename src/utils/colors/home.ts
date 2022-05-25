import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getHomeColors = (theme: ColorSchemeName) => {
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
  const alertColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;

  return {
    primaryColor,
    secondaryColor,
    primaryCardColor,
    secondaryCardColor,
    textColor,
    alertColor,
  };
};

export const getEstimateColors = (theme: ColorSchemeName) => {
  const backgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;

  const estimateColors = {
    month:
      theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER,
    value:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    indicator:
      theme === 'dark'
        ? Colors.ORANGE_SECONDARY_DARKER
        : Colors.ORANGE_SECONDARY_LIGHTER,
  };

  return {
    backgroundColor,
    estimateColors,
  };
};

export const getLastTransactionsColors = (theme: ColorSchemeName) => {
  const iconColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const backgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const expanseColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const incomeColor =
    theme === 'dark'
      ? Colors.INCOME_PRIMARY_DARKER
      : Colors.INCOME_PRIMARY_LIGTHER;

  return {
    backgroundColor,
    iconColor,
    textColor,
    expanseColor,
    incomeColor,
  };
};
