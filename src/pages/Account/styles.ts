import { RFPercentage } from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
interface TextProps {
  color: string;
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

  margin: ${RFPercentage(3)}px 0 ${RFPercentage(1.5)}px 0;
`;

export const Col = styled.View`
  flex: 1;
`;

export const Row = styled.View`
  flex-direction: row;
  width: 100%;
`;

export const ButtonContainer = styled.View`
  margin-top: ${RFPercentage(6.4)}px;
`;

export const DeleteButton = styled.TouchableOpacity`
  align-self: center;
  margin: 16px 0;
`;
