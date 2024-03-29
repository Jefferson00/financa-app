import { RFPercentage } from 'react-native-responsive-fontsize';
import styled, { css } from 'styled-components/native';

interface ModalProps {
  visible: boolean;
}

interface ButtonTextProps {
  color: string;
  size?: number;
}

interface ButtonProps {
  backgroundColor: string;
}

interface AccountItemProps {
  backgroundColor: string;
  borderColor?: string;
  selected?: boolean;
}

interface ContentProps {
  backgroundColor?: string;
}

interface TextProps {
  color?: string;
}

export const Container = styled.View<ModalProps>`
  flex: 1;
  justify-content: center;
  align-items: center;

  display: ${props => (props.visible ? 'flex' : 'none')};
`;

export const Wrapper = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  padding: 0 28px;
`;

export const Content = styled.View<ContentProps>`
  background: ${props =>
    props.backgroundColor ? props.backgroundColor : '#fff'};
  align-items: center;
  padding: 34px 22px;
  border-radius: 20px;
  width: 100%;
`;

export const Title = styled.Text<TextProps>`
  font-family: 'Poppins-SemiBold';
  margin-top: ${RFPercentage(2.2)}px;
  font-size: ${RFPercentage(2.2)}px;
  text-align: center;

  color: ${props => (props.color ? props.color : '#000')};
`;

export const OkButton = styled.TouchableOpacity`
  margin-top: ${RFPercentage(2.2)}px;
`;

export const ButtonText = styled.Text<ButtonTextProps>`
  font-family: 'Poppins-SemiBold';
  font-size: ${props =>
    props.size ? `${RFPercentage(props.size)}px` : `${RFPercentage(2.5)}px`};
  text-align: center;
  color: ${props => props.color};
`;

export const ConfirmationButtons = styled.View`
  margin-top: ${RFPercentage(2.2)}px;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
`;

export const Button = styled.TouchableOpacity<ButtonProps>`
  background-color: ${props => props.backgroundColor};
  flex: 1;
  margin-right: 8px;
  height: ${RFPercentage(6)}px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
`;

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

export const AccountName = styled.Text<TextProps>`
  font-family: 'Poppins-Regular';
  font-size: ${RFPercentage(2)}px;

  color: ${props => (props.color ? props.color : '#000')};
`;
