import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface BalanceProps {
  color: string;
}

interface LastTransactionsProps {
  backgroundColor?: string;
  color?: string;
}

interface DotProps {
  active?: boolean;
}

export const Container = styled.View`
  justify-content: flex-start;
  background-color: transparent;
  position: relative;
  top: -5%;

  padding-bottom: ${RFPercentage(8)}px;
`;

export const AccountCardWrapper = styled.View`
  width: ${width}px;
  height: ${RFPercentage(20)}px;
`;

export const AccountDots = styled.View`
  flex-direction: row;
  justify-content: center;

  padding: ${RFPercentage(2)}px;
`;

export const Dot = styled.View<DotProps>`
  width: 15px;
  height: 15px;

  border-radius: 6.5px;

  background-color: #f9c33c;

  margin: 0 8px;
  opacity: 0.6;

  ${props =>
    props.active &&
    css`
      border: 1px solid #ff981e;
      opacity: 1;
    `}
`;

export const BalanceContainer = styled.View`
  flex-direction: row;
  justify-content: space-between;

  padding: 0 ${RFPercentage(3.2)}px;
  margin-top: ${RFPercentage(3.2)}px;
`;
export const Balance = styled.View`
  justify-content: center;
  align-items: center;
`;
export const BalanceText = styled.Text<BalanceProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;

  color: ${props => props.color};
`;
export const BalanceValue = styled.Text<BalanceProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;

  margin-top: 16px;
  color: ${props => props.color};
`;

export const Estimates = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-top: ${RFPercentage(4.4)}px;
`;

export const LastTransactions = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-top: ${RFPercentage(4.4)}px;
`;

export const LastTransactionsView = styled.View<LastTransactionsProps>`
  height: ${RFPercentage(8)}px;
  background-color: ${props => props.backgroundColor};

  border-radius: 10px;
  margin-top: 8px;

  flex-direction: row;

  align-items: center;

  padding: ${RFPercentage(2.4)}px;

  overflow: hidden;
`;

export const TransactionText = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  flex: 1;
  text-align: center;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
  width: 50%;
  flex: 1;
  max-width: 50%;
  overflow: hidden;
`;

export const TransactionTitle = styled.Text`
  margin: 0 ${RFPercentage(1.5)}px;
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;

  max-width: 80%;
  overflow: hidden;
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

export const TransactionDate = styled.Text`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.5)}px;
  flex: 1;
`;
