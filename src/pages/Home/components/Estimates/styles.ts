import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface EstimatesProps {
  backgroundColor?: string;
  monthTextColor?: string;
  valueTextColor?: string;
  indicatorColor?: string;
  indicatorVelue?: number;
  isEmpty?: boolean;
}

export const EstimateView = styled.View<EstimatesProps>`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;

  height: ${props =>
    props.isEmpty ? `${RFPercentage(20)}px` : `${RFPercentage(25)}px`};
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
  max-height: ${RFPercentage(100)}px;
  border-radius: 10px;
  background-color: ${props => props.indicatorColor};
`;
