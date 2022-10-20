import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import Animated from 'react-native-reanimated';
import { RectButton } from 'react-native-gesture-handler';

interface TextProps {
  color: string;
}

interface CardProps {
  backgroundColor?: string;
}

export const VisibleContent = styled(Animated.View)<CardProps>`
  margin-top: ${RFPercentage(3)}px;
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
  padding: ${RFPercentage(3)}px;
  border-radius: 20px;

  min-height: ${RFPercentage(25)}px;

  justify-content: space-between;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Main = styled.View`
  margin-top: ${RFPercentage(3)}px;
`;

export const Row = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const Title = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Subtitle = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2.3)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const Text = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(1.8)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const HiddenContent = styled(Animated.View)<CardProps>`
  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : '#000'};
  border-bottom-right-radius: 20px;
  border-bottom-left-radius: 20px;
  // padding-bottom: ${RFPercentage(3.2)}px;
`;

export const ItemView = styled.View`
  margin: 0 ${RFPercentage(3.2)}px;

  margin-bottom: ${RFPercentage(3.2)}px;
`;

export const HighlightContainer = styled.View`
  background-color: #ffffff5a;
`;

export const ItemCard = styled.Pressable`
  height: ${RFPercentage(13)}px;

  border-radius: 20px;
  background-color: #ffffff5a;
  margin: ${RFPercentage(2)}px 0;

  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  padding: ${RFPercentage(2.5)}px;
`;

export const DateTitle = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2.5)}px;
  margin-top: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const DollarSign = styled.View`
  height: ${RFPercentage(8)}px;
  width: ${RFPercentage(8)}px;
  background-color: #fff;
  border-radius: ${RFPercentage(4)}px;

  justify-content: center;
  align-items: center;
`;

export const ItemInfo = styled.View`
  align-items: flex-end;
`;

export const ItemTitle = styled.Text`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;

  color: #000;
`;

export const ItemValue = styled.Text`
  font-family: 'Poppins-SemiBold';
  font-size: ${RFPercentage(2)}px;

  color: #fff;
`;

export const DeleteButton = styled(RectButton)`
  width: ${RFPercentage(20)}px;
  height: ${RFPercentage(8)}px;

  justify-content: center;
  align-items: center;

  position: relative;

  margin-top: ${RFPercentage(6.5)}px;
  border-radius: 20px;

  padding-left: ${RFPercentage(6)}px;

  right: ${RFPercentage(1)}px;
`;

export const EditCardButton = styled.TouchableOpacity`
  height: ${RFPercentage(6)}px;
  width: ${RFPercentage(6)}px;
  border-radius: ${RFPercentage(3)}px;
  background-color: #fff;

  justify-content: center;
  align-items: center;
`;

export const DeleteCardButton = styled.TouchableOpacity`
  height: ${RFPercentage(6)}px;
  width: ${RFPercentage(6)}px;
  border-radius: ${RFPercentage(3)}px;
  background-color: #fff;
  margin-left: ${RFPercentage(2)}px;

  justify-content: center;
  align-items: center;
`;
