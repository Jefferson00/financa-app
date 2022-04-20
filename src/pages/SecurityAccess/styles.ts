import React from 'react';
import { Dimensions } from 'react-native';
import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
const width = Dimensions.get('screen').width;

interface TextProps {
  color?: string;
}

export const Container = styled(Animated.View)`
  flex: 1;
  align-items: center;
  padding: 16px 24px;
  transition: all 0.5s;
`;

export const KeyboardText = styled.Text<TextProps>`
  color: ${props => (props.color ? props.color : '#fff')};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;

  margin-bottom: ${RFPercentage(2)}px;
`;

export const Logo = styled.Image`
  margin-bottom: ${RFPercentage(6)}px;
`;

export const FingerPrint = styled.TouchableOpacity`
  margin-top: ${RFPercentage(6)}px;
`;
