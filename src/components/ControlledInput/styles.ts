import { RFPercentage } from 'react-native-responsive-fontsize';
import MaskInput from 'react-native-mask-input';
import styled, { css } from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

export const Container = styled.View`
  margin-bottom: ${RFPercentage(3.2)}px;
`;

interface InputContainerProps {
  backgroundColor: string;
  borderColor?: string;
  disabled?: boolean;
  isFocused?: boolean;
  isErrored?: boolean;
}

export const InputContainer = styled.View<InputContainerProps>`
  height: ${RFPercentage(7)}px;
  width: 100%;
  flex-direction: row;
  border-radius: 4px;

  background-color: ${props => props.backgroundColor};

  align-items: center;
  justify-content: flex-end;
  position: relative;

  ${props =>
    props.isErrored &&
    css`
      border-width: 2px;
      border-color: #cc3728;
    `}
  ${props =>
    props.isFocused &&
    css`
      border-width: 2px;
      border-color: #2673ce;
    `}

  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
    `}
`;

interface IconProps {
  backgroundColor: string;
}

export const Icon = styled.View<IconProps>`
  width: 56px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  position: absolute;
`;

interface TextProps {
  color: string;
}

export const InputText = styled(MaskInput)<TextProps>`
  flex: 1;
  margin-left: 8px;
  color: ${props => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
`;

export const Alert = styled.Text<TextProps>`
  color: ${props => props.color};
  font-size: ${RFPercentage(1.8)}px;
  font-family: 'Poppins-Regular';
  text-align: left;
  margin-left: ${RFPercentage(1.5)}px;
`;

export const Label = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;
  align-self: flex-start;
`;

export const InputSelect = styled(Picker)`
  width: 100%;
`;

export const LabelContainer = styled.View`
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
  margin-bottom: ${RFPercentage(1.1)}px;
`;
