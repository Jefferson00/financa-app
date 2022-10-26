import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.ScrollView`
  margin-top: ${RFPercentage(2.5)}px;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const IconCircle = styled.View`
  align-items: center;
  justify-content: center;
  width: ${RFPercentage(4)}px;
  height: ${RFPercentage(4)}px;
  border-radius: ${RFPercentage(2)}px;
  margin-right: 8px;
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
