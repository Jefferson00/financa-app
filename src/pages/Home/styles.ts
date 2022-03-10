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

export const Card = styled.View<CardProps>`
  width: 269px;
  height: 149px;
  margin: 0 auto;
  border-radius: 10px;

  padding: 24px;

  flex-direction: row;
`;

export const CardInfo = styled.View<CardProps>`
  width: 80%;
  height: 100%;
  justify-content: flex-start;
`;

export const CardTitle = styled.Text<CardProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;

  color: #fff;
`;

export const CardBalance = styled.Text<CardProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(3)}px;

  margin-top: 16px;
  color: #fff;
`;

export const CardSubBalance = styled.Text<CardProps>`
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
  margin-top: 32px;
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
  font-size: ${RFPercentage(2)}px;

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
`;
