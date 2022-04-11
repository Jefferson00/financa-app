import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';

interface ContainerProps {
  backgroundColor: string;
}

interface MonthProps {
  color: string;
}

export const Container = styled.View<ContainerProps>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: ${RFPercentage(6)}px ${RFPercentage(3.2)}px ${RFPercentage(9.5)}px
    ${RFPercentage(2.5)}px;
`;
export const Avatar = styled.Image`
  height: ${RFPercentage(6.5)}px;
  width: ${RFPercentage(6.5)}px;
  // border-radius: ${RFPercentage(3.25)}px;
`;
export const EmptyAvatar = styled.View`
  height: ${RFPercentage(6.5)}px;
  width: ${RFPercentage(6.5)}px;
  border-radius: ${RFPercentage(3.25)}px;
  background-color: #d2d2d2;
`;
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
export const Month = styled(Animated.Text)<MonthProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3.2)}px;
  margin: 0 ${RFPercentage(1)}px; ;
`;
