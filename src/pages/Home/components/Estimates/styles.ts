import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface EstimatesProps {
  backgroundColor?: string;
  monthTextColor?: string;
  valueTextColor?: string;
  indicatorColor?: string;
  indicatorVelue?: number;
}

export const Estimates = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-top: 16px;
`;

export const EstimateView = styled.View<EstimatesProps>`
  flex-direction: row;
  justify-content: space-evenly;
  align-items: flex-end;

  height: ${RFPercentage(25)}px;
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
  max-height: ${RFPercentage(10)}px;
  border-radius: 10px;
  background-color: ${props => props.indicatorColor};
`;
