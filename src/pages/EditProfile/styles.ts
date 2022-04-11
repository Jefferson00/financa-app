import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
const width = Dimensions.get('screen').width;

interface ContainerProps {
  backgroundColor: string;
}

interface TextProps {
  color: string;
}

interface ButtonProps {
  color?: string;
  backgroundColor?: string;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  align-items: center;
  background-color: ${props => props.backgroundColor};
  padding: 16px 24px;
  padding-bottom: 96px;
`;

export const EmptyAvatar = styled.View`
  height: ${RFPercentage(16)}px;
  width: ${RFPercentage(16)}px;
  border-radius: ${RFPercentage(8)}px;
  background-color: #d2d2d2;
  margin-top: 64px;
  margin-bottom: 32px;
`;

export const Avatar = styled.Image`
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const Label = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;
  align-self: flex-start;
`;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;

export const Subtitle = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
`;

export const MainButtonContainer = styled.View``;

export const LogoutContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
`;
