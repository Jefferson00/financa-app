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

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  width: 100%;
  height: 86px;
  background-color: ${props => props.backgroundColor};
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
  width: 30px;
  flex: 1;
  justify-content: center;
  align-items: center;
  padding-top: 16px;

  opacity: ${props => (props.isActive ? 1 : 0.5)};
`;

export const AnimatedView = styled(Animated.View)``;
