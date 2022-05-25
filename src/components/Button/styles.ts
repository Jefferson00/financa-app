import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface MainContainer {
  backgroundColor: string;
  borderColor?: string;
}

interface IconContainer {
  backgroundColor: string;
}

interface TextColor {
  color: string;
}

export const Pressable = styled.Pressable`
  width: 100%;

  opacity: ${props => (props.disabled ? 0.6 : 1)};
`;
export const Container = styled(Animated.View)`
  height: ${RFPercentage(9)}px;
  width: 100%;
  flex-direction: row;
`;
export const Main = styled.View<MainContainer>`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
`;
export const MainText = styled.Text<TextColor>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.3)}px;
`;

export const SubText = styled.Text<TextColor>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
`;

export const Icon = styled.View<IconContainer>`
  width: ${RFPercentage(9.5)}px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
