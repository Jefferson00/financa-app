import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getIncomesColors = (theme: ColorSchemeName) => {
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

  return {
    primaryColor,
    secondaryColor,
    primaryCardColor,
    secondaryCardColor,
    secondaryCardLoader,
    titleColor,
    dateTitleColor,
    textColor,
    alertColor,
  };
};
