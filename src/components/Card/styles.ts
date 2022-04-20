import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

interface ContainerProps {
  backgroundColor?: string;
  id?: string;
}

export const Container = styled(LinearGradient)<ContainerProps>`
  width: ${RFPercentage(38)}px;
  height: 149px;
  margin: 0 auto;
  border-radius: 10px;

  padding: ${RFPercentage(3)}px;

  flex-direction: row;
`;

export const CardInfo = styled.View<ContainerProps>`
  width: 80%;
  height: 100%;
  justify-content: flex-start;
`;

export const CardTitle = styled.Text<ContainerProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  text-align: center;
  color: #fff;
`;

export const CardBalance = styled.Text<ContainerProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3)}px;

  margin-top: ${RFPercentage(2)}px;
  color: #fff;
`;

export const CardSubBalance = styled.Text<ContainerProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.8)}px;

  line-height: ${RFPercentage(2)}px;
  opacity: 0.8;
  color: #fff;
`;

export const IconContainer = styled.View`
  width: ${RFPercentage(6.8)}px;
  height: ${RFPercentage(6.8)}px;
  border-radius: ${RFPercentage(3.4)}px;

  align-items: center;
  justify-content: center;

  background-color: #fff;
`;

export const AddButton = styled.TouchableOpacity``;

export const AddCardContainer = styled.View`
  flex: 1;
  justify-content: space-between;
  align-items: center;
`;
