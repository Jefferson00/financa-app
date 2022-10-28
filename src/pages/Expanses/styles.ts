import { ColorSchemeName, Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { colors } from '../../styles/colors';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
const width = Dimensions.get('screen').width;

interface TextProps {
  color: string;
}

interface TitleItemProps {
  selected?: boolean;
}

export const Container = styled.View`
  justify-content: flex-start;
  background-color: transparent;
  position: relative;
  top: -5%;
`;

export const AccountCardWrapper = styled.View`
  width: ${width}px;
  height: ${RFPercentage(20)}px;
`;

export const IncomesTitle = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-bottom: ${RFPercentage(3)}px;

  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

export const TitleItem = styled.TouchableOpacity<TitleItemProps>`
  flex-direction: row;
`;

export const TitleItemView = styled.TouchableOpacity<TitleItemProps>`
  flex-direction: row;
`;

export const IncomesTitleText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(4.4)}px;
`;

export const IncomesList = styled.FlatList`
  padding: 0 ${RFPercentage(3.2)}px;
  width: 100%;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: flex-start;
  padding-top: ${RFPercentage(10)}px;
  height: ${RFPercentage(30)}px;
`;

export const EmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFPercentage(2.2)}px;
`;

export const RowButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const IconCircle = styled.View`
  align-items: center;
  justify-content: center;
  width: ${RFPercentage(4)}px;
  height: ${RFPercentage(4)}px;
  border-radius: ${RFPercentage(2)}px;
  margin-right: 8px;
`;

interface TextProps {
  fontWeight: 'SemiBold' | 'Medium' | 'Regular';
  fontSize: number;
  color: string;
}

export const Text = styled.Text<TextProps>`
  font-family: ${props => `Poppins-${props.fontWeight}`};
  font-size: ${props => RFPercentage(props.fontSize)}px;
  color: ${props => (props.color ? props.color : '#000')};
`;

export const expansesColors = (theme: ColorSchemeName) => {
  if (theme === 'dark') {
    return {
      primary: colors.red.dark[500],
      secondary: colors.red.dark[400],
      title: colors.gray[600],
      text: colors.gray[600],
      icon_circle: colors.dark[700],
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
        PRIMARY_BACKGROUND: colors.red.dark[500],
        SECOND_BACKGROUND: colors.red.dark[400],
        TEXT: colors.white,
      },
    };
  }
  return {
    primary: colors.red[500],
    secondary: colors.red[400],
    title: colors.gray[600],
    text: colors.gray[600],
    icon_circle: colors.red[100],
    header: [colors.red[500], colors.red[600]],
    loading: {
      background: colors.red[100],
      foreground: colors.white,
    },
    empty: {
      icon: colors.red[500],
      text: colors.gray[600],
    },
    button: {
      PRIMARY_BACKGROUND: colors.red[500],
      SECOND_BACKGROUND: colors.red[400],
      TEXT: colors.white,
    },
  };
};
