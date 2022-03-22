import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import LinearGradient from 'react-native-linear-gradient';

interface ContainerProps {
  backgroundColor?: string;
}

export const Container = styled(LinearGradient)`
  width: 269px;
  height: 149px;
  margin: 0 auto;
  border-radius: 10px;

  padding: 24px;

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

  margin-top: 16px;
  color: #fff;
`;

export const CardSubBalance = styled.Text<ContainerProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.8)}px;

  line-height: 16px;
  opacity: 0.8;
  color: #fff;
`;

export const IconContainer = styled.View`
  width: 50px;
  height: 50px;
  border-radius: 25px;

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
