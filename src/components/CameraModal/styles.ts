import styled, { css } from 'styled-components/native';
import { RFPercentage } from 'react-native-responsive-fontsize';

interface ButtonsProps {
  type?: 'ok' | 'cancel';
  color?: string;
}
interface ModalContentProps {
  backgroundColor?: string;
}
interface ButtonProps {
  backgroundColor?: string;
}
interface TitleProps {
  color?: string;
}

export const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
export const ContainerContent = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background: #00000090;
  padding: 0 ${RFPercentage(3.45)}px;
`;
export const ModalContent = styled.View<ModalContentProps>`
  background: ${props =>
    props.backgroundColor ? props.backgroundColor : '#fff'};
  height: ${RFPercentage(38.5)}px;
  align-items: center;
  justify-content: space-between;
  border-radius: 20px;
  width: 100%;
`;

export const Title = styled.Text<TitleProps>`
  color: ${props => (props.color ? props.color : '#000')};
  font-size: ${RFPercentage(2.45)}px;
  font-family: 'Poppins-SemiBold';
  margin-top: ${RFPercentage(5.5)}px;
`;
export const ButtonsContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
export const Button = styled.TouchableOpacity<ButtonProps>`
  margin: 0 ${RFPercentage(2.45)}px;
  width: ${RFPercentage(13.5)}px;
  height: ${RFPercentage(13.5)}px;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: ${props =>
    props.backgroundColor ? props.backgroundColor : '#f1f1f1'};
`;
export const ButtonCancel = styled.TouchableOpacity`
  margin: ${RFPercentage(2.45)}px 0 ${RFPercentage(4.45)}px 0;
`;
export const TextButton = styled.Text<ButtonsProps>`
  font-size: ${RFPercentage(2.45)}px;
  font-family: 'Poppins-Regular';

  ${props =>
    props.type === 'ok' &&
    css`
      color: ${props.color ? props.color : '#12baba'};
    `}
  ${props =>
    props.type === 'cancel' &&
    css`
      color: ${props.color ? props.color : '#bababa'};
    `}
`;
