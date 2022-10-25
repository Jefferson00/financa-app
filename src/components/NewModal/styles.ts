import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';
import { colors } from '../../styles/colors';

interface ModalProps {
  visible: boolean;
}

export const Container = styled.View<ModalProps>`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

export const Wrapper = styled.Pressable`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: ${colors.modal_bg};
  padding: 0 ${RFPercentage(3)}px;
`;

export const Content = styled.View`
  background: #fff;
  align-items: center;
  padding: 34px 22px;
  border-radius: 8px;
  width: 100%;
`;

interface TextProps {
  color: string;
  fontSize: number;
  fontWeight: 'SemiBold' | 'Medium' | 'Regular';
}

export const Text = styled.Text<TextProps>`
  font-family: ${props => `Poppins-${props.fontWeight}`};
  font-size: ${props => RFPercentage(props.fontSize)}px;
  color: ${props => (props.color ? props.color : '#000')};
  text-align: center;
`;

interface ButtonProps {
  backgroundColor: string;
}

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props => props.backgroundColor};
  width: ${RFPercentage(13)}px;
  border-radius: 4px;
  padding: ${RFPercentage(1.5)}px 0;
`;

export const Row = styled.View`
  flex-direction: row;
  align-items: center;
  margin-top: ${RFPercentage(4.4)}px;
`;

interface AccountItemProps {
  backgroundColor: string;
  borderColor?: string;
  selected?: boolean;
}

export const AccountItem = styled.TouchableOpacity<AccountItemProps>`
  background-color: ${props => props.backgroundColor};
  width: 100%;
  border-radius: 10px;
  height: ${RFPercentage(6)}px;
  margin: ${RFPercentage(1)}px 0;
  padding: 0 ${RFPercentage(2)}px;

  justify-content: center;

  ${props =>
    props.selected &&
    css`
      border: 1px solid;
      border-color: ${props.borderColor ? props.borderColor : '#000'};
    `}
`;

export const SelectContent = styled.View`
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: center;
  align-items: center;
`;

export const SelectItem = styled.View`
  margin: ${RFPercentage(1)}px;
`;

interface ColorPalettProps {
  backgroundColor: string;
}

export const ColorItem = styled.View<ColorPalettProps>`
  width: ${RFPercentage(4.4)}px;
  height: ${RFPercentage(4.4)}px;

  border-radius: 4px;

  background-color: ${props =>
    props.backgroundColor ? props.backgroundColor : 'transparent'};
`;
