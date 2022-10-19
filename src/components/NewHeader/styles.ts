import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

interface ContainerProps {
  reduced?: boolean;
}

interface GradientProps {
  backgroundColor?: string;
}

export const Container = styled(Animated.View)<ContainerProps>`
  height: ${RFPercentage(36)}px;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  border-bottom-right-radius: ${RFPercentage(6)}px;
`;

export const Gradient = styled(LinearGradient)<GradientProps>`
  flex: 1;

  padding: ${RFPercentage(6)}px ${RFPercentage(3)}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
