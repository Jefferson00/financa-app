import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getProfileColors = (theme: ColorSchemeName) => {
  const backgroundColor =
    theme === 'dark' ? Colors.BACKGROUND_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const btnBackgroundColor =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : '#fff';
  const btnColor = theme === 'dark' ? '#c5c5c5' : '#09192D';
  const btnIconColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor = theme === 'dark' ? '#c5c5c5' : '#fff';
  const signOutBtnColor =
    theme === 'dark'
      ? Colors.EXPANSE_PRIMARY_DARKER
      : Colors.EXPANSE_PRIMARY_LIGTHER;
  const alertColor = '#ffaea7';
  const modalBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.BACKGROUND_LIGTHER;

  return {
    backgroundColor,
    btnBackgroundColor,
    btnColor,
    btnIconColor,
    textColor,
    signOutBtnColor,
    alertColor,
    modalBackground,
  };
};

export const getEditProfileColors = (theme: ColorSchemeName) => {
  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;

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
  const modalBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.BACKGROUND_LIGTHER;

  return {
    titleColor,
    inputBackground,
    textColor,
    saveButtonColors,
    modalBackground,
  };
};
