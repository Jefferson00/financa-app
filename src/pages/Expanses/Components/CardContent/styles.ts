import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';

interface TextProps {
  color: string;
}

interface CardProps {
  backgroundColor?: string;
}

export const VisibleContent = styled(Animated.View)<CardProps>`
  margin-top: ${RFPercentage(3)}px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
  padding: ${RFPercentage(3)}px;
  border-radius: 20px;

  min-height: ${RFPercentage(25)}px;

  justify-content: space-between;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Main = styled.View`
  margin-top: ${RFPercentage(3)}px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Subtitle = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.3)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Text = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.8)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const HiddenContent = styled(Animated.View)<CardProps>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  // padding-bottom: ${RFPercentage(3.2)}px;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;

  padding-bottom: ${RFPercentage(3.2)}px;
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
