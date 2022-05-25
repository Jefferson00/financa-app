import React from 'react';
import { Text, TextInputProps } from 'react-native';
import { MaskInputProps } from 'react-native-mask-input';
import * as S from './styles';

interface ButtonProps extends MaskInputProps {
  icon?: React.FC;
  background: string;
  border?: string;
  textColor: string;
  disabled?: boolean;
  prefix?: string;
  width?: number;
}

export default function Input({
  background,
  icon: Icon,
  border,
  textColor,
  disabled,
  prefix,
  width,
  ...rest
}: ButtonProps) {
  return (
    <S.Container
      style={{ maxWidth: width }}
      backgroundColor={background}
      disabled={disabled}
      prefix={prefix}>
      {Icon && <Icon />}
      <S.InputText {...rest} color={textColor} editable={!disabled} />
      {prefix && <S.Prefix color={textColor}>{prefix}</S.Prefix>}
    </S.Container>
  );
}
