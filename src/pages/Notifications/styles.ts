import React from 'react';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
  backgroundColor: string;
}
interface ButtonProps {
  color?: string;
  backgroundColor?: string;
}

export const Container = styled.View`
  flex: 1;

  align-items: center;
`;

export const EmptyAvatar = styled.View`
  background-color: #d2d2d2;
  margin-top: ${RFPercentage(8)}px;
  margin-bottom: ${RFPercentage(4)}px;
  align-items: center;
  justify-content: center;
`;

export const Avatar = styled.Image`
  margin-top: ${RFPercentage(8)}px;
  margin-bottom: ${RFPercentage(4)}px;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#fff'};
  color: ${props => (props.color ? props.color : '#09192D')};

  width: 100%;
  height: ${RFPercentage(8)}px;
  border-radius: 10px;
  padding: 0 ${RFPercentage(1.5)}px;
  margin: 8px 0;

  position: relative;
`;

export const MainButtonContainer = styled.View`
  margin-top: ${RFPercentage(3)}px;
`;

export const LogoutContainer = styled.View`
  flex: 1;
  justify-content: flex-end;
  align-items: flex-end;
`;

export const ButtonText = styled.Text<ButtonProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.4)}px;

  color: ${props => (props.color ? props.color : '#09192D')};
`;

export const RemindView = styled.View`
  width: 100%;
  margin-top: ${RFPercentage(2)}px;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: ${RFPercentage(2)}px;
`;

interface IconContainerProps {
  backgroundColor: string;
}

export const IconContainer = styled.View<IconContainerProps>`
  background-color: ${props => props.backgroundColor};
  width: ${RFPercentage(4)}px;
  height: ${RFPercentage(4)}px;
  border-radius: ${RFPercentage(2)}px;
  justify-content: center;
  align-items: center;
  margin-right: ${RFPercentage(1.3)}px;
`;

interface ItemProps {
  backgroundColor: string;
  borderColor: string;
}

export const Item = styled.View<ItemProps>`
  flex-direction: row;

  background-color: ${props => props.backgroundColor};
  border-bottom-width: 1px;
  border-style: solid;
  border-color: ${props => props.borderColor};
  border-radius: 8px;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  margin-bottom: ${RFPercentage(2.4)}px;
  padding: ${RFPercentage(2.4)}px;
`;

interface TextProps {
  fontWeight?: 'SemiBold' | 'Medium' | 'Regular';
  fontSize?: number;
  color?: string;
}

export const Text = styled.Text<TextProps>`
  font-family: ${props =>
    `Poppins-${props.fontWeight ? props.fontWeight : `Regular`}`};
  font-size: ${props => RFPercentage(props.fontSize ? props.fontSize : 2)}px;
  color: ${props => (props.color ? props.color : '#000')};
`;

export const DateText = styled.Text`
  flex: 1;
  margin-bottom: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.4)}px;
`;

export const ItemTitle = styled.View`
  flex-direction: row;
`;
