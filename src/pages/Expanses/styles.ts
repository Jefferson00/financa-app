import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface TextProps {
  color: string;
}

interface TitleItemProps {
  selected?: boolean;
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
  justify-content: space-between;
`;

export const TitleItem = styled.TouchableOpacity<TitleItemProps>`
  flex-direction: row;
`;

export const TitleItemView = styled.TouchableOpacity<TitleItemProps>`
  flex-direction: row;
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
  justify-content: flex-start;
  width: 100%;
  height: ${RFPercentage(30)}px;
`;

export const EmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: ${RFPercentage(2.2)}px;
`;

export const RowButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const IconCircle = styled.View`
  align-items: center;
  justify-content: center;
  width: ${RFPercentage(4)}px;
  height: ${RFPercentage(4)}px;
  border-radius: ${RFPercentage(2)}px;
  margin-right: 8px;
`;

interface TextProps {
  fontWeight: 'SemiBold' | 'Medium' | 'Regular';
  fontSize: number;
  color: string;
}

export const Text = styled.Text<TextProps>`
  font-family: ${props => `Poppins-${props.fontWeight}`};
  font-size: ${props => RFPercentage(props.fontSize)}px;
  color: ${props => (props.color ? props.color : '#000')};
`;
