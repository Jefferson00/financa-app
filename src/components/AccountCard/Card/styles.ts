import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import Animated from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';

export const Container = styled(LinearGradient)`
  width: ${RFPercentage(30)}px;
  height: ${RFPercentage(20)}px;
  margin: 0 auto;
  border-radius: 10px;

  padding: ${RFPercentage(3)}px;

  flex-direction: row;

  margin-right: ${RFPercentage(5)}px;
  transition: color 0.4s;
`;

export const CardInfo = styled.Pressable`
  height: 100%;
  margin-top: ${RFPercentage(1)}px;
  justify-content: flex-start;
`;

export const CardTitle = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.9)}px;

  color: #fff;
`;

export const EmptyCardTitle = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  text-align: center;
  color: #fff;
`;

export const CardBalance = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3)}px;

  color: #fff;
`;

export const CardSubBalance = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.8)}px;

  line-height: ${RFPercentage(2)}px;
  opacity: 0.8;
  color: #fff;
`;

export const IconContainer = styled.View`
  width: ${RFPercentage(4)}px;
  height: ${RFPercentage(4)}px;
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
