import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RectButton } from 'react-native-gesture-handler';

interface CardProps {
  backgroundColor?: string;
}
export const HiddenContent = styled(Animated.View)<CardProps>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  // padding-bottom: ${RFPercentage(3.2)}px;
`;

export const ItemView = styled.View`
  margin: 0 ${RFPercentage(3.2)}px;

  margin-bottom: ${RFPercentage(3.2)}px;
`;

interface TextProps {
  fontWeight?: 'Semibold' | 'Regular' | 'Medium';
  fontSize?: number;
  color?: string;
}

export const Text = styled.Text<TextProps>`
  color: ${props => (props.color ? props.color : '#fff')};
  font-family: ${props =>
    props.fontWeight ? `Poppins-${props.fontWeight}` : `Poppins-SemiBold`};
  font-size: ${props =>
    props.fontSize ? RFPercentage(props.fontSize) : RFPercentage(2.3)}px;
`;

export const ItemCard = styled.Pressable`
  height: ${RFPercentage(10)}px;

  border-radius: 8px;
  background-color: rgba(255, 255, 255, 0.2);
  margin-bottom: ${RFPercentage(2)}px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: ${RFPercentage(2.5)}px;
`;

export const DeleteButton = styled(RectButton)`
  width: ${RFPercentage(20)}px;
  height: ${RFPercentage(8)}px;

  justify-content: center;
  align-items: center;

  position: relative;

  margin-top: ${RFPercentage(1.1)}px;
  border-radius: 8px;

  background-color: #fff;

  padding-left: ${RFPercentage(6)}px;

  right: ${RFPercentage(2)}px;
`;

export const DollarSign = styled.View`
  height: ${RFPercentage(6)}px;
  width: ${RFPercentage(6)}px;
  background-color: #fff;
  border-radius: ${RFPercentage(3)}px;

  justify-content: center;
  align-items: center;
`;

export const ItemInfo = styled.View`
  align-items: flex-end;
`;

export const HighlightContainer = styled.View`
  background-color: #ffffff5a;
`;
