import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface ContainerProps {
  backgroundColor: string,
  borderColor?: string;
}

interface IconContainer {
  backgroundColor: string,
}

interface TextColor {
  color: string,
}

export const Container = styled.View<ContainerProps>`
  height: ${RFPercentage(7)}px;
  width: 100%;
  flex-direction: row;
  border-radius: 10px;

  background-color: ${(props) => props.backgroundColor};

  align-items: center;
`
export const Icon = styled.View<IconContainer>`
  width: 56px;
  align-items: center;
  justify-content: center;
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
`

export const InputText = styled.TextInput<TextColor>`
  flex: 1;
  margin-left: 8px;
  color:${(props) => props.color};
  font-size: ${RFPercentage(2)}px;
  font-family: 'Poppins-Regular';
`