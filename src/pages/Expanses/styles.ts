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
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const IncomesList = styled.FlatList`
  padding: 0 ${RFPercentage(3.2)}px;
  width: 100%;
`;

export const Empty = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
  flex-direction: row;
  justify-content: center;

  height: ${RFPercentage(32)}px;
`;

export const ItemView = styled.View`
  padding: 0 ${RFPercentage(3.2)}px;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;
export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;
