import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

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

interface TextProps {
  fontWeight?: 'Semibold' | 'Regular' | 'Medium';
  fontSize?: number;
  color: string;
}

export const Text = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: ${props =>
    props.fontWeight ? `Poppins-${props.fontWeight}` : `Poppins-SemiBold`};
  font-size: ${props =>
    props.fontSize ? RFPercentage(props.fontSize) : RFPercentage(2.3)}px;
`;

export const Button = styled.TouchableOpacity`
  height: ${RFPercentage(6)}px;
  width: ${RFPercentage(6)}px;
  border-radius: ${RFPercentage(3)}px;
  background-color: #fff;

  justify-content: center;
  align-items: center;
`;
