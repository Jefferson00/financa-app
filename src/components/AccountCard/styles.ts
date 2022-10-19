import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled(LinearGradient)`
  width: ${RFPercentage(38)}px;
  height: ${RFPercentage(20)}px;
  margin: 0 auto;
  border-radius: 10px;

  padding: ${RFPercentage(3)}px;

  flex-direction: row;
`;
