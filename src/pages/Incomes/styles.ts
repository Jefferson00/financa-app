import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface TextProps {
  color: string;
}

export const Container = styled.View`
  justify-content: flex-start;
  background-color: transparent;
  position: relative;
  top: -5%;
`;

export const AccountCardWrapper = styled.View`
  width: ${width}px;
  height: ${RFPercentage(20)}px;
`;

export const IncomesTitle = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  margin-bottom: ${RFPercentage(3)}px;

  flex-direction: row;
  align-items: flex-end;
  justify-content: flex-start;
`;

export const IncomesTitleText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(4.4)}px;
`;

export const IncomesList = styled.FlatList`
  padding: 0 ${RFPercentage(3.2)}px;
  width: 100%;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;
export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;
