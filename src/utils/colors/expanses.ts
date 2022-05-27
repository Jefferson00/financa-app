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
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.EXPANSE_SOFT_LIGTHER;
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

  const creditCardButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_PRIMARY_DARKER
        : Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  const switchColors = {
    background:
      theme === 'dark'
        ? Colors.ORANGE_SECONDARY_DARKER
        : Colors.ORANGE_SECONDARY_LIGHTER,
    trackColor: {
      true:
        theme === 'dark'
          ? Colors.EXPANSE_SECONDARY_DARKER
          : Colors.EXPANSE_SECONDARY_LIGTHER,
      false: theme === 'dark' ? '#737373' : '#d2d2d2',
    },
    thumbColor: {
      true:
        theme === 'dark'
          ? Colors.EXPANSE_PRIMARY_DARKER
          : Colors.EXPANSE_PRIMARY_LIGTHER,
      false:
        theme === 'dark'
          ? Colors.EXPANSE_SECONDARY_DARKER
          : Colors.EXPANSE_SECONDARY_LIGTHER,
    },
  };

  const modalBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.BACKGROUND_LIGTHER;

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
    creditCardButtonColors,
    switchColors,
    modalBackground,
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
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.EXPANSE_SOFT_LIGTHER;
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

  const modalBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.BACKGROUND_LIGTHER;

  return {
    inputBackground,
    deleteButtonColor,
    titleColor,
    textColor,
    trackColor,
    thumbColor,
    saveButtonColors,
    modalBackground,
  };
};

export const getCreateCreditCardColors = (theme: ColorSchemeName) => {
  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.EXPANSE_SOFT_LIGTHER;

  const saveButtonColors = {
    PRIMARY_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_PRIMARY_DARKER
        : Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND:
      theme === 'dark'
        ? Colors.BLUE_SECONDARY_DARKER
        : Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: theme === 'dark' ? '#d8d8d8' : '#fff',
  };

  return {
    inputBackground,
    titleColor,
    textColor,
    saveButtonColors,
  };
};
