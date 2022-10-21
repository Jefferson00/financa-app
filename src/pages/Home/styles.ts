import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
interface BalanceProps {
  color: string;
}

export const Container = styled.View`
  justify-content: flex-start;
  background-color: transparent;

  padding-bottom: ${RFPercentage(10)}px;
`;

export const EmptyAccountAlert = styled.Text<BalanceProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
  flex: 1;
  text-align: center;
  padding: ${RFPercentage(2)}px;
  padding-bottom: 0;
  width: 60%;
  align-self: center;

  color: ${props => (props.color ? props.color : '#000')};
`;
