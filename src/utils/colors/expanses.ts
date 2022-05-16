import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getExpansesColors = (theme: ColorSchemeName) => {
  const primaryColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const secondaryColor =
    theme === 'dark'
      ? Colors.EXPANSE_SECONDARY_DARKER
      : Colors.EXPANSE_SECONDARY_LIGTHER;
  const primaryCardColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const secondaryCardColor =
    theme === 'dark'
      ? Colors.EXPANSE_SECONDARY_DARKER
      : Colors.EXPANSE_SECONDARY_LIGTHER;
  const secondaryCardLoader =
    theme === 'dark' ? Colors.EXPANSE_SOFT_DARKER : Colors.EXPANSE_SOFT_LIGTHER;
  const titleColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
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

export const getCreateExpansesColors = (theme: ColorSchemeName) => {
  const titleColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.EXPANSE_SOFT_DARKER : Colors.EXPANSE_SOFT_LIGTHER;
  const deleteButtonColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const trackColor = {
    true:
      theme === 'dark'
        ? Colors.EXPANSE_SECONDARY_DARKER
        : Colors.EXPANSE_SECONDARY_LIGTHER,
    false: theme === 'dark' ? '#737373' : '#d2d2d2',
  };

  const thumbColor = {
    true:
      theme === 'dark'
        ? Colors.EXPANSE_PRIMARY_DARKER
        : Colors.EXPANSE_PRIMARY_LIGTHER,
    false:
      theme === 'dark'
        ? Colors.EXPANSE_SECONDARY_DARKER
        : Colors.EXPANSE_SECONDARY_LIGTHER,
  };

  const saveButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.EXPANSE_PRIMARY_DARKER
        : Colors.EXPANSE_PRIMARY_LIGTHER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.EXPANSE_SECONDARY_DARKER
        : Colors.EXPANSE_SECONDARY_LIGTHER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  return {
    inputBackground,
    deleteButtonColor,
    titleColor,
    textColor,
    trackColor,
    thumbColor,
    saveButtonColors,
  };
};
