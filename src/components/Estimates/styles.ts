import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

export const Container = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-top: ${RFPercentage(4.4)}px;
`;

export const BalanceText = styled.Text`
  font-family: 'Poppins-Medium';
  font-size: ${RFPercentage(2)}px;

  color: #5e5e5e;
`;

export const BalanceValue = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;

  color: #09192d;
`;
