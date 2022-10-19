import styled, { css } from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';

export const MonthSelector = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const PrevButton = styled.Pressable``;
export const NextButton = styled.Pressable``;
export const MonthContainer = styled.View`
  width: ${RFPercentage(19)}px;
  align-items: center;
  overflow: hidden;
`;
export const Month = styled(Animated.Text)`
  color: #fff;
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3.2)}px;
  margin: 0 ${RFPercentage(1)}px; ;
`;
