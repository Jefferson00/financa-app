import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface MainContainer {
  backgroundColor: string;
  borderColor?: string;
}

interface ActionContainer {
  backgroundColor: string;
}

interface TextColor {
  color: string;
}

export const Container = styled(Animated.View)<MainContainer>`
  width: 100%;

  border-radius: 20px;
  overflow: hidden;

  margin-top: ${RFPercentage(3)}px;
`;

export const Main = styled.View`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: ${RFPercentage(11)}px;
  padding: 0 ${RFPercentage(3)}px; ;
`;

export const TitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const ValueContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const TitleText = styled.Text<TextColor>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.3)}px;
`;

export const ValueText = styled.Text<TextColor>`
  color: ${props => props.color};
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;
`;

export const ActionContainer = styled.View<ActionContainer>`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  height: ${RFPercentage(4)}px;

  background-color: ${props => props.backgroundColor};

  padding: 0 ${RFPercentage(3)}px; ;
`;
