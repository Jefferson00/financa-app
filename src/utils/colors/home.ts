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
