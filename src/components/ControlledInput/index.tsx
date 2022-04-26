import React from 'react';
import { Control, Controller } from 'react-hook-form';
import { Switch } from 'react-native';
import { MaskInputProps } from 'react-native-mask-input';
import { priceMask } from '../../utils/masks';
import * as S from './styles';

interface ButtonProps extends MaskInputProps {
  icon?: React.FC;
  background: string;
  border?: string;
  textColor: string;
  control: Control<any>;
  name: string;
  disabled?: boolean;
  currencyFormater?: boolean;
  type?: 'select' | 'switch';
}

export default function ControlledInput({
  background,
  icon: Icon,
  border,
  textColor,
  control,
  name,
  type,
  disabled,
  currencyFormater,
  ...rest
}: ButtonProps) {
  return (
    <Controller
      name={name}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field, fieldState }) => (
        <S.Container backgroundColor={background} disabled={disabled}>
          {Icon && <Icon />}
          {type === 'select' && (
            <S.InputSelect
              mode="dropdown"
              selectedValue={field.value}
              onValueChange={field.onChange}
              itemStyle={{
                backgroundColor: '#a55c5c',
              }}>
              <S.InputSelect.Item
                label="Conta Corrente"
                value="Conta Corrente"
              />
              <S.InputSelect.Item
                label="Conta Poupança"
                value="Conta Poupança"
              />
              <S.InputSelect.Item label="Outro" value="Outro" />
            </S.InputSelect>
          )}
          {type !== 'select' && type !== 'switch' && (
            <S.InputText
              {...rest}
              color={textColor}
              onChangeText={field.onChange}
              value={currencyFormater ? priceMask(field.value) : field.value}
              editable={!disabled}
            />
          )}
          {type === 'switch' && (
            <Switch
              trackColor={{ true: textColor, false: textColor }}
              thumbColor={field.value === 'active' ? textColor : textColor}
              value={field.value === 'active'}
              onChange={() => {
                if (field.value === 'active') {
                  field.onChange('inative');
                } else {
                  field.onChange('active');
                }
              }}
            />
          )}
          {fieldState.invalid && (
            <S.Alert color="red">{fieldState.error?.message}</S.Alert>
          )}
        </S.Container>
      )}
    />
  );
}
