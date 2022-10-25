import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { ScrollView as GestureHandlerScrollView } from 'react-native-gesture-handler';

interface TextProps {
  color: string;
}

interface ExpandableCardProps {
  backgroundColor: string;
}

export const Container = styled.View`
  width: 100%;
`;

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(3.2)}px;
`;

export const EmptyContainer = styled.View`
  margin-top: ${RFPercentage(4.4)}px;
  width: 100%;
  flex: 1;
`;

export const Empty = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  justify-content: center;
  height: ${RFPercentage(32)}px;
`;

export const EmptyContent = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const ExpandableCard = styled.Pressable``;

export const CardView = styled(Animated.View)<ExpandableCardProps>`
  min-height: ${RFPercentage(25)}px;
  border-radius: 20px;
  margin-bottom: ${RFPercentage(3)}px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
`;

export const HiddenContent = styled(Animated.View)`
  //opacity: 0;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const ItemCard = styled.View`
  height: ${RFPercentage(10)}px;
  border-radius: 20px;
  background-color: #ffffffaa;
`;

export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;
