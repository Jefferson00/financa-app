import { RFPercentage } from 'react-native-responsive-fontsize';
import MaskInput from 'react-native-mask-input';
import styled, { css } from 'styled-components/native';

interface ContainerProps {
  backgroundColor: string;
  borderColor?: string;
  disabled?: boolean;
  prefix?: string;
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
`;

export const InputText = styled(MaskInput)<TextColor>`
  flex: 1;
  margin-left: 8px;
  color: ${props => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';

  position: relative;
`;

export const Prefix = styled.Text<TextColor>`
  flex: 1;
  margin-left: 8px;
  color: ${props => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
  position: absolute;

  right: ${RFPercentage(1.5)}px;
`;
