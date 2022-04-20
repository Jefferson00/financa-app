import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { MaskInputProps } from 'react-native-mask-input';
import * as S from './styles';

interface ButtonProps extends MaskInputProps {
  icon?: React.FC;
  background: string;
  border?: string;
  textColor: string;
  control: Control<any>;
  name: string;
}

export default function ControlledInput({
  background,
  icon: Icon,
  border,
  textColor,
  control,
  name,
  ...rest
}: ButtonProps) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <S.Container backgroundColor={background}>
          {Icon && <Icon />}
          <S.InputText
            {...rest}
            color={textColor}
            onChangeText={field.onChange}
            value={field.value}
          />
        </S.Container>
      )}
    />
  );
}
