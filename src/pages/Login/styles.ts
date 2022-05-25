import styled from 'styled-components/native';
import { RFPercentage, RFValue } from 'react-native-responsive-fontsize';

interface ColorsProps {
  background: string;
}

export const Container = styled.View<ColorsProps>`
  flex: 1;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${RFPercentage(10)}px ${RFPercentage(4)}px ${RFPercentage(4)}px
    ${RFPercentage(4)}px;
  background-color: ${props => props.background};
`;

export const Logo = styled.Image``;

export const Main = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  width: ${RFPercentage(50)}px;
`;

export const MainText = styled.Text`
  font-size: ${RFPercentage(5)}px;
  font-family: 'Poppins-SemiBold';
  line-height: ${RFPercentage(7)}px;
  text-align: center;
  color: #ffffff;
`;

export const ButtonContainer = styled.View``;
