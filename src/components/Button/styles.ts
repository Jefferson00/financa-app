import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { Pressable as RNPressable } from 'react-native';

export const Pressable = styled(RNPressable)`
  width: 100%;
  opacity: ${props => (props.disabled ? 0.6 : 1)};
`;

export const Container = styled(Animated.View)`
  height: ${RFPercentage(9)}px;
  width: 100%;
  flex-direction: row;
`;
interface MainProps {
  backgroundColor: string;
  borderColor?: string;
}

export const Main = styled.View<MainProps>`
  flex: 1;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
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

interface IconProps {
  backgroundColor: string;
}

export const Icon = styled.View<IconProps>`
  width: ${RFPercentage(9.5)}px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`;
