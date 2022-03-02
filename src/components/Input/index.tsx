import React from 'react';
import { TextInputProps } from 'react-native';
import * as S from './styles';

interface ButtonProps extends TextInputProps {
  icon?: React.FC;
  background: string;
  border?: string;
  textColor: string;
}

export default function Input({
  background,
  icon: Icon,
  border,
  textColor,
  ...rest
}: ButtonProps) {
  return (
    <S.Container backgroundColor={background}>
      {Icon && <Icon />}
      <S.InputText {...rest} color={textColor} />
    </S.Container>
  );
}
