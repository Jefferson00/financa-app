import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
interface TextProps {
  color: string;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: 16px 24px;
  padding-bottom: 96px;
`;

export const EmptyAvatar = styled.View`
  height: ${RFPercentage(16)}px;
  width: ${RFPercentage(16)}px;
  border-radius: ${RFPercentage(8)}px;
  background-color: #d2d2d2;
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const Avatar = styled.Image`
  margin-top: 32px;
  margin-bottom: 32px;
`;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;
