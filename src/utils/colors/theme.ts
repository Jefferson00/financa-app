import { ColorSchemeName } from 'react-native';
import { Colors } from '../../styles/global';

export const getThemeScreenColors = (theme: ColorSchemeName) => {
  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const trackColor =
    theme === 'dark'
      ? Colors.BLUE_PRIMARY_DARKER
      : Colors.BLUE_SECONDARY_LIGHTER;
  const falseTrackColor = theme === 'dark' ? '#919191' : '#d2d2d2';
  const thumbColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const falseThumbColor =
    theme === 'dark'
      ? Colors.BLUE_SECONDARY_LIGHTER
      : Colors.BLUE_SECONDARY_LIGHTER;
  const modalBackground =
    theme === 'dark'
      ? Colors.CARD_BACKGROUND_DARKER
      : Colors.BACKGROUND_LIGTHER;

  return {
    titleColor,
    textColor,
    trackColor,
    falseTrackColor,
    thumbColor,
    falseThumbColor,
    modalBackground,
  };
};
