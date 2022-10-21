import React, { useState } from 'react';
import {
  Control,
  Controller,
  ControllerFieldState,
  ControllerRenderProps,
} from 'react-hook-form';
import { Switch } from 'react-native';
import { MaskInputProps } from 'react-native-mask-input';
import { useTheme } from '../../hooks/ThemeContext';
import { colors } from '../../styles/colors';
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
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);

  const switchInput = (field: ControllerRenderProps<any, string>) => {
    return (
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
    );
  };

  const selectInput = (field: ControllerRenderProps<any, string>) => {
    return (
      <S.InputSelect
        mode="dropdown"
        selectedValue={field.value}
        dropdownIconColor={textColor}
        onValueChange={field.onChange}>
        {selectItems &&
          selectItems.map(item => (
            <S.InputSelect.Item
              key={item.id}
              label={item.name}
              value={item.id}
              color={textColor}
            />
          ))}
      </S.InputSelect>
    );
  };

  const textInput = (field: ControllerRenderProps<any, string>) => {
    return (
      <S.InputText
        {...rest}
        color={textColor}
        onChangeText={field.onChange}
        value={currencyFormater ? priceMask(field.value) : field.value}
        editable={!disabled}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
    );
  };

  const labelComponent = (fieldState: ControllerFieldState) => {
    const alertColor =
      theme === 'dark' ? colors.red.dark[500] : colors.red[500];

    return (
      <S.LabelContainer>
        <S.Label color={fieldState.invalid ? alertColor : textColor}>
          {label}
        </S.Label>
        {fieldState.invalid && (
          <S.Alert color={alertColor}>{fieldState.error?.message}</S.Alert>
        )}
      </S.LabelContainer>
    );
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <S.Container>
          {label && labelComponent(fieldState)}
          <S.InputContainer
            backgroundColor={background}
            disabled={disabled}
            isFocused={isFocused}
            isErrored={fieldState.invalid}>
            {Icon && <Icon />}
            {type !== 'select' && type !== 'switch' && textInput(field)}
            {type === 'select' && selectInput(field)}
            {type === 'switch' && switchInput(field)}
          </S.InputContainer>
        </S.Container>
      )}
    />
  );
}
