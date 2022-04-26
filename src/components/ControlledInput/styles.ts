import { RFPercentage } from 'react-native-responsive-fontsize';
import MaskInput from 'react-native-mask-input';
import styled, { css } from 'styled-components/native';
import { Picker } from '@react-native-picker/picker';

interface ContainerProps {
  backgroundColor: string;
  borderColor?: string;
  disabled?: boolean;
}

interface IconContainer {
  backgroundColor: string;
}

interface TextColor {
  color: string;
}

export const Container = styled.View<ContainerProps>`
  height: ${RFPercentage(7)}px;
  width: 100%;
  flex-direction: row;
  border-radius: 10px;

  background-color: ${props => props.backgroundColor};

  align-items: center;
  justify-content: flex-end;
  position: relative;

  ${props =>
    props.disabled &&
    css`
      opacity: 0.6;
    `}
`;
export const Icon = styled.View<IconContainer>`
  width: 56px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
  position: absolute;
`;

export const InputText = styled(MaskInput)<TextColor>`
  flex: 1;
  margin-left: 8px;
  color: ${props => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
`;

export const Alert = styled.Text<TextColor>`
  color: ${props => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
`;
export const InputSelect = styled(Picker)`
  width: 100%;
`;
