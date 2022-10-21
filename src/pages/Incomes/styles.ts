import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface TextProps {
  color: string;
}

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(4.4)}px;
`;

export const EmptyContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyRow = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const EmptyText = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
  margin-left: 8px;

  color: ${props => (props.color ? props.color : '#000')};
`;
