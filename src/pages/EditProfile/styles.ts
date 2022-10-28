import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
interface TextProps {
  color: string;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;
  padding: ${RFPercentage(4.4)}px ${RFPercentage(3.2)}px;
  padding-bottom: ${RFPercentage(16)}px;
`;

export const EmptyAvatar = styled.View`
  height: ${RFPercentage(16)}px;
  width: ${RFPercentage(16)}px;
  border-radius: ${RFPercentage(8)}px;
  background-color: #d2d2d2;
`;

export const Avatar = styled.Image``;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;

export const AvatarContainer = styled.View`
  position: relative;
  margin-bottom: ${RFPercentage(4.4)}px;
`;

export const UpdateAvatarButton = styled.TouchableOpacity`
  position: absolute;
  bottom: 10%;
  right: 0;
  z-index: 5;
  width: ${RFPercentage(4.5)}px;
  height: ${RFPercentage(4.5)}px;
  background: #4876ac;
  border-radius: ${RFPercentage(2.25)}px;
  align-items: center;
  justify-content: center;
`;
