import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
const width = Dimensions.get('screen').width;

interface TextProps {
  color: string;
}

interface CardProps {
  color?: string;
}

interface KeyboardContainerProps {
  color?: string;
}

export const Container = styled(Animated.View)`
  flex: 1;
  align-items: center;
  padding: 16px 24px;
  padding-bottom: ${RFPercentage(20)}px;

  transition: all 0.5s;
`;

export const Label = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;
  align-self: flex-start;
`;

export const ThemeMainContainer = styled.View`
  flex: 1;
  align-items: center;
  position: relative;
`;

export const ThemeIconContainer = styled(Animated.View)`
  flex: 1;
  height: 100%;
  justify-content: center;
  position: absolute;
`;

export const ButtonContainer = styled(Animated.View)`
  border: 1px solid;
  border-radius: 10px;
  height: ${RFPercentage(7)}px;
  width: ${RFPercentage(34)}px;

  position: absolute;
  bottom: 0;

  align-items: center;
  justify-content: center;
`;

export const Button = styled.TouchableOpacity`
  height: ${RFPercentage(7)}px;
  width: ${RFPercentage(34)}px;

  position: absolute;
  bottom: 0;

  align-items: center;
  justify-content: center;
`;

export const ButtonText = styled(Animated.Text)`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.1)}px;
`;

export const ConfigCard = styled.View<CardProps>`
  width: 100%;
  border: 1px solid ${props => props.color};
  padding: ${RFPercentage(2.1)}px;
  border-radius: 10px;
  margin-top: ${RFPercentage(2)}px;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MainTitle = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;
`;

export const Subtitle = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.8)}px;
`;

export const TextContainer = styled.View``;
export const Switch = styled.Switch``;

export const KeyboardContainer = styled.View<KeyboardContainerProps>`
  margin-top: ${RFPercentage(6)}px;
  border: 1px solid ${props => props.color};

  padding: ${RFPercentage(2.1)}px;
  border-radius: 10px;

  align-items: center;
`;

export const KeyboardText = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;

  margin-bottom: ${RFPercentage(2)}px;
`;
