import styled from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface BalanceTextProps {
  color: string;
  fontSize: number;
  fontWeight: 'Regular' | 'SemiBold' | 'Medium';
}

export const BalanceText = styled.Text<BalanceTextProps>`
  font-family: ${props => `Poppins-${props.fontWeight}`};
  font-size: ${props => RFPercentage(props.fontSize)}px;
  color: ${props => props.color};
`;
