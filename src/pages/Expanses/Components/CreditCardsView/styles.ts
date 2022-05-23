import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

interface TextProps {
  color: string;
}

interface ExpandableCardProps {
  backgroundColor: string;
}

export const Container = styled.ScrollView`
  padding: 0 ${RFPercentage(3.2)}px;

  flex: 1;
`;

export const Empty = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  flex-direction: row;
  justify-content: center;

  height: ${RFPercentage(32)}px;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
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
