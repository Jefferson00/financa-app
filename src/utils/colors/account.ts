import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getAccountColors = (theme: ColorSchemeName) => {
  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const deleteButtonColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const trackColor = {
    true:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    false: theme === 'dark' ? '#737373' : '#d2d2d2',
  };

  const thumbColor = {
    true:
      theme === 'dark'
        ? Colors.BLUE_PRIMARY_DARKER
        : Colors.BLUE_PRIMARY_LIGHTER,
    false:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
  };

  return {
    inputBackground,
    deleteButtonColor,
    titleColor,
    textColor,
    thumbColor,
    trackColor,
  };
};
