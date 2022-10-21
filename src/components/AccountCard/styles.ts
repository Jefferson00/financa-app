import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { ColorSchemeName } from 'react-native';
import { colors } from '../../styles/colors';

export const ScrollView = styled.ScrollView.attrs(() => ({
  contentContainerStyle: {
    paddingHorizontal: RFPercentage(4.3),
  },
}))`
  margin-top: ${RFPercentage(4.3)}px;
`;

export const accountCardColors = (theme: ColorSchemeName) => {
  if (theme === 'dark') {
    return {
      card: {
        primary: [colors.orange.dark[500], colors.orange.dark[400]],
        secondary: [colors.blue.dark[600], colors.blue.dark[500]],
        icon: {
          primary: colors.orange.dark[500],
          secondary: colors.blue.dark[600],
        },
      },
      loading: {
        background: colors.dark[700],
        foreground: colors.gray[600],
      },
    };
  }
  return {
    card: {
      primary: [colors.orange[500], colors.orange[400]],
      secondary: [colors.blue[600], colors.blue[500]],
      icon: {
        primary: colors.orange[500],
        secondary: colors.blue[600],
      },
    },
    loading: {
      background: colors.orange[500],
      foreground: colors.white,
    },
  };
};
