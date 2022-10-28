import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
  backgroundColor: string;
}

interface TextProps {
  color: string;
}

interface ButtonProps {
  color?: string;
  backgroundColor?: string;
  border?: string;
}

export const Container = styled.View<ContainerProps>`
  flex: 1;
  background-color: ${props => props.backgroundColor};

  align-items: center;
`;

export const AvatarContainer = styled.View`
  position: absolute;
  top: 10%;

  align-items: center;
  justify-content: center;

  width: 100%;
`;

export const EmptyAvatar = styled.View`
  background-color: #d2d2d2;
  // margin-top: ${RFPercentage(8)}px;
  // margin-bottom: ${RFPercentage(4)}px;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.Image``;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.8)}px;
`;

export const Alert = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;

export const Subtitle = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#fff'};
  color: ${props => (props.color ? props.color : '#09192D')};

  width: 100%;
  height: ${RFPercentage(6)}px;
  border-radius: 10px;
  padding: 0 ${RFPercentage(1.5)}px;
  margin: 8px 0;

  position: relative;

  border-width: 1px;
  border-style: solid;
  border-color: ${props => (props.border ? props.border : 'transparent')}; ;
`;

export const MainButtonContainer = styled.View`
  margin-top: ${RFPercentage(3)}px;
`;

export const LogoutContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
  margin-top: ${RFPercentage(4.4)}px;
`;

export const ButtonText = styled.Text<ButtonProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.3)}px;

  color: ${props => (props.color ? props.color : '#09192D')};
`;
