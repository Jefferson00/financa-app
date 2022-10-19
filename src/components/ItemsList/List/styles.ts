import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  margin-top: ${RFPercentage(2.5)}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

interface TextProps {
  fontWeight: 'SemiBold' | 'Medium' | 'Regular';
  fontSize: number;
  color: string;
}

export const Text = styled.Text<TextProps>`
  font-family: ${props => `Poppins-${props.fontWeight}`};
  font-size: ${props => RFPercentage(props.fontSize)}px;
  color: ${props => (props.color ? props.color : '#000')};
`;
