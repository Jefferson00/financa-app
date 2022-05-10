import React, { useEffect, useState } from 'react';
import { Control, Controller } from 'react-hook-form';
import { Switch, Text, View } from 'react-native';
import { MaskInputProps } from 'react-native-mask-input';
import { priceMask } from '../../utils/masks';
import * as S from './styles';

interface ButtonProps extends MaskInputProps {
  icon?: React.FC;
  background: string;
  border?: string;
  textColor: string;
  trackColor?: {
    true: string;
    false: string;
  };
  thumbColor?: {
    true: string;
    false: string;
  };
  control: Control<any>;
  name: string;
  disabled?: boolean;
  currencyFormater?: boolean;
  type?: 'select' | 'switch';
  label?: string;
  selectItems?: any[];
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
  label,
  currencyFormater,
  selectItems,
  trackColor,
  thumbColor,
  ...rest
}: ButtonProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <>
          {label && (
            <S.LabelContainer>
              <S.Label color={fieldState.invalid ? '#CC3728' : textColor}>
                {label}
              </S.Label>
              {fieldState.invalid && (
                <S.Alert color="red">{fieldState.error?.message}</S.Alert>
              )}
            </S.LabelContainer>
          )}
          <S.Container
            backgroundColor={background}
            disabled={disabled}
            isFocused={isFocused}
            isErrored={fieldState.invalid}>
            {Icon && <Icon />}
            {type === 'select' && (
              <S.InputSelect
                mode="dropdown"
                selectedValue={field.value}
                onValueChange={field.onChange}>
                {selectItems &&
                  selectItems.map(item => (
                    <S.InputSelect.Item
                      key={item.id}
                      label={item.name}
                      value={item.id}
                    />
                  ))}
              </S.InputSelect>
            )}
            {type !== 'select' && type !== 'switch' && (
              <S.InputText
                {...rest}
                color={textColor}
                onChangeText={field.onChange}
                value={currencyFormater ? priceMask(field.value) : field.value}
                editable={!disabled}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
              />
            )}
            {type === 'switch' && (
              <Switch
                trackColor={{
                  true: trackColor?.true || '#000',
                  false: trackColor?.false || '#000',
                }}
                thumbColor={
                  field.value === 'active'
                    ? thumbColor?.true || '#000'
                    : thumbColor?.false || '#000'
                }
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
          </S.Container>
        </>
      )}
    />
  );
}
