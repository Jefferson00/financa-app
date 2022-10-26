import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface LastTransactionsViewProps {
  backgroundColor: string;
}

export const LastTransactionsView = styled.View<LastTransactionsViewProps>`
  height: ${RFPercentage(10)}px;
  background-color: ${props => props.backgroundColor};

  border-radius: 8px;
  margin-bottom: ${RFPercentage(2)}px;

  flex-direction: row;

  align-items: center;

  padding: ${RFPercentage(2.4)}px;

  overflow: hidden;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 50%;
  flex: 1;
  max-width: 50%;
  overflow: hidden;
`;

interface TextProps {
  color?: string;
}

export const TransactionTitle = styled.Text<TextProps>`
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

export const TransactionValue = styled.Text<TextProps>`
  margin: 0;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.8)}px;
  flex: 1;
  color: ${props => (props.color ? props.color : '#000')};
`;

export const TransactionDate = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.5)}px;
  flex: 1;

  color: ${props => (props.color ? props.color : '#444444cc')};
`;
