import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface LastTransactionsProps {
  backgroundColor?: string;
  color?: string;
}

export const LastTransactions = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  padding-bottom: ${RFPercentage(3)}px;
  margin-top: ${RFPercentage(4.4)}px;
`;

export const BalanceText = styled.Text`
  font-family: 'Poppins-Medium';
  font-size: ${RFPercentage(2)}px;
  margin-bottom: ${RFPercentage(3)}px;
  color: #5e5e5e;
`;

export const LastTransactionsView = styled.View<LastTransactionsProps>`
  height: ${RFPercentage(11)}px;
  background-color: ${props => props.backgroundColor};

  border-radius: 10px;
  margin-top: 8px;

  flex-direction: row;

  align-items: center;

  padding: ${RFPercentage(2.4)}px;

  overflow: hidden;
`;

export const TransactionText = styled.Text<LastTransactionsProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  flex: 1;
  text-align: center;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 50%;
  flex: 1;
  max-width: 50%;
  overflow: hidden;
`;

export const TransactionTitle = styled.Text<LastTransactionsProps>`
  margin: 0 ${RFPercentage(1.5)}px;
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;

  max-width: 80%;
  overflow: hidden;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const DetailsContainer = styled.View`
  align-items: flex-end;

  flex: 1;
`;

export const TransactionValue = styled.Text<LastTransactionsProps>`
  margin: 0;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
  flex: 1;
  color: ${props => (props.color ? props.color : '#000')};
`;

export const TransactionDate = styled.Text<LastTransactionsProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.5)}px;
  flex: 1;

  color: ${props => (props.color ? props.color : '#000')};
`;
