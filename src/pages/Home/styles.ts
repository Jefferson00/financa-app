import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface CardProps {
  backgroundColor?: string;
}

interface BalanceProps {
  color: string;
}
interface EstimatesProps {
  backgroundColor?: string;
  monthTextColor?: string;
  valueTextColor?: string;
  indicatorColor?: string;
  indicatorVelue?: number;
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

  padding-bottom: 86px;
`;

export const AccountCardWrapper = styled.View`
  width: ${width}px;
  height: 149px;
`;

export const AccountDots = styled.View`
  flex-direction: row;
  justify-content: center;

  padding: 16px;
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

  padding: 0 16px;
  margin-top: ${RFPercentage(2.5)}px;
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
export const BalanceValue = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;

  margin-top: 16px;
`;

export const Estimates = styled.View`
  padding: 0 16px;
  margin-top: 16px;
`;

export const EstimateView = styled.View<EstimatesProps>`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;

  height: 120px;
  border-radius: 10px;
  margin-top: 8px;
  padding: 16px;
  background-color: ${props => props.backgroundColor};
`;

export const EstimateInMonth = styled.View`
  align-items: center;
  max-height: 100%;
  margin-right: 16px;
`;

export const EstimateMonthText = styled.Text<EstimatesProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.8)}px;

  color: ${props => props.monthTextColor};
`;
export const EstimateMonthValue = styled.Text<EstimatesProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(1.5)}px;

  color: ${props => props.valueTextColor};
`;

export const EstimateIndicator = styled.View<EstimatesProps>`
  height: ${props =>
    props.indicatorVelue ? `${props.indicatorVelue}px` : `4px`};
  width: 100%;
  max-height: 40px;
  border-radius: 10px;
  background-color: ${props => props.indicatorColor};
`;

export const LastTransactions = styled.View`
  padding: 0 16px;
  margin-top: 16px;
`;

export const LastTransactionsView = styled.View<LastTransactionsProps>`
  min-height: 70px;
  background-color: ${props => props.backgroundColor};

  border-radius: 10px;
  margin-top: 8px;

  flex-direction: row;
  justify-content: space-between;
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

  max-width: 50%;
  overflow: hidden;
`;

export const TransactionTitle = styled.Text`
  margin: 0 ${RFPercentage(1.5)}px;
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.1)}px;
  max-width: 80%;
  overflow: hidden;
  flex: 1;
`;

export const DetailsContainer = styled.View`
  flex-direction: row;
  align-items: center;

  max-width: 50%;
`;

export const TransactionValue = styled.Text<LastTransactionsProps>`
  margin: 0 ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const TransactionDate = styled.Text`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
`;
