import { RFPercentage } from 'react-native-responsive-fontsize';
import MaskInput from 'react-native-mask-input';
import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';

interface ContainerProps {
  backgroundColor: string;
}

interface ButtonProps {
  isActive: boolean;
}

export const Container = styled(Animated.View)`
  flex-direction: row;
  width: 100%;
  height: ${RFPercentage(13)}px;
  align-items: flex-start;
  justify-content: center;

  border-top-left-radius: 40px;
  border-top-right-radius: 40px;

  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export const MenuButton = styled.Pressable<ButtonProps>`
  opacity: ${props => (props.isActive ? 1 : 0.5)};
`;

export const MenuView = styled.View`
  width: ${RFPercentage(4)}px;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: ${RFPercentage(2.5)}px;

  position: relative;
`;

export const AnimatedView = styled(Animated.View)``;

export const Dot = styled.View`
  width: ${RFPercentage(2)}px;
  height: ${RFPercentage(2)}px;
  background-color: #4876ac;
  position: absolute;
  border-radius: ${RFPercentage(1)}px;
  top: 25%;
  right: 20%;
`;
