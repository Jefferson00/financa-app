import Icon from 'react-native-vector-icons/Feather';
import React from 'react';

export function getCategoryIcon(
  category: string,
  color: string,
  size?: number,
) {
  switch (category) {
    case 'Casa':
      return (
        <Icon
          name="home"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Salário':
      return (
        <Icon
          name="dollar-sign"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Benefício':
      return (
        <Icon
          name="dollar-sign"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Transferência':
      return (
        <Icon
          name="dollar-sign"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Lazer':
      return (
        <Icon
          name="trash"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Transporte':
      return (
        <Icon
          name="trash"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Educação':
      return (
        <Icon
          name="trash"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Comunicação':
      return (
        <Icon
          name="trash"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Saúde':
      return (
        <Icon
          name="trash"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    case 'Outro':
      return (
        <Icon
          name="dollar-sign"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
    default:
      return (
        <Icon
          name="dollar-sign"
          color={color}
          size={size}
          style={{ marginRight: 8 }}
        />
      );
  }
}
