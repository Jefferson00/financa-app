import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

interface TextProps {
  color: string;
}

interface SelectOptionProps {
  color?: string;
  backgroundColor?: string;
  border?: string;
  checked?: boolean;
}

export const Container = styled.View`
  flex: 1;
  align-items: center;

  padding: ${RFPercentage(4.4)}px ${RFPercentage(3.2)}px;
  padding-bottom: ${RFPercentage(16)}px;
`;

export const Label = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.2)}px;
  align-self: flex-start;

  margin-bottom: ${RFPercentage(1.1)}px;
`;

export const Title = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
`;

export const Subtitle = styled.Text<TextProps>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;
`;

export const Col = styled.View`
  flex: 1;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
  margin-bottom: ${RFPercentage(3.2)}px;
`;

export const SwitchContainer = styled.View`
  flex: 1;
`;

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(3.2)}px;
`;

export const DeleteButton = styled.TouchableOpacity`
  align-self: center;
  margin: 16px 0;
`;

export const SelectOption = styled.TouchableOpacity<SelectOptionProps>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#E2EDF0'};

  flex-direction: row;
  align-items: center;

  padding: ${RFPercentage(1.3)}px;
  border-radius: 4px;

  ${props =>
    props.checked &&
    css`
      border: 1px solid;
      border-color: ${props.color ? props.color : '#09192D'};
    `}
`;

export const Option = styled.Text<SelectOptionProps>`
  color: ${props => (props.color ? props.color : '#09192D')};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.3)}px;

  margin-right: ${RFPercentage(0.8)}px;
`;
