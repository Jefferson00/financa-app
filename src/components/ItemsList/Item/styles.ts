import styled from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RFPercentage } from 'react-native-responsive-fontsize';
import { RectButton } from 'react-native-gesture-handler';

interface MainContainer {
  backgroundColor: string;
  borderColor?: string;
}

interface ActionContainer {
  backgroundColor: string;
  borderColor: string;
}

interface DeleteButton {
  backgroundColor: string;
}

interface TextColor {
  color: string;
}

export const Container = styled(Animated.View)<MainContainer>`
  width: 100%;

  border-radius: 8px;
  overflow: hidden;

  margin-bottom: ${RFPercentage(2)}px;
`;

export const Main = styled.TouchableOpacity`
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  height: ${RFPercentage(6)}px;
  padding: 0 ${RFPercentage(2)}px;
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
  font-size: ${RFPercentage(1.9)}px;
`;

export const SubtitleText = styled.Text<TextColor>`
  color: ${props => props.color};
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.8)}px;
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
  height: ${RFPercentage(3.5)}px;

  background-color: ${props => props.backgroundColor};

  padding: 0 ${RFPercentage(3)}px;

  border-bottom-width: 1px;
  border-bottom-color: ${props => props.borderColor};
  border-bottom-style: solid;

  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
`;

export const DeleteButton = styled(RectButton)<DeleteButton>`
  width: ${RFPercentage(20)}px;
  height: ${RFPercentage(8)}px;
  background-color: ${props => props.backgroundColor};

  justify-content: center;
  align-items: center;

  position: relative;

  border-radius: 8px;

  margin-top: ${RFPercentage(1)}px;
  padding-left: ${RFPercentage(3)}px;

  right: ${RFPercentage(5)}px;
`;
