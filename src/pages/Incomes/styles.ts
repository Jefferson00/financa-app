import { ColorSchemeName } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import styled from 'styled-components/native';

interface TextProps {
  color: string;
}

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(4.4)}px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding-top: ${RFPercentage(10)}px;
  height: ${RFPercentage(30)}px;
`;

export const EmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const incomesColors = (theme: ColorSchemeName) => {
  if (theme === 'dark') {
    return {
      header: [colors.dark[800], colors.dark[800]],
      loading: {
        background: colors.dark[700],
        foreground: colors.gray[600],
      },
      empty: {
        icon: colors.dark[700],
        text: colors.blue[200],
      },
      button: {
        PRIMARY_BACKGROUND: colors.green.dark[500],
        SECOND_BACKGROUND: colors.green.dark[400],
        TEXT: colors.white,
      },
    };
  }
  return {
    header: [colors.green[500], colors.green[600]],
    loading: {
      background: colors.green[100],
      foreground: colors.white,
    },
    empty: {
      icon: colors.green[500],
      text: colors.gray[600],
    },
    button: {
      PRIMARY_BACKGROUND: colors.green[500],
      SECOND_BACKGROUND: colors.green[400],
      TEXT: colors.white,
    },
  };
};
