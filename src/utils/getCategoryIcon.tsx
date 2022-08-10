import Icon from 'react-native-vector-icons/Feather';
import React from 'react';

export function getCategoryIcon(
  category: string,
  color: string,
  size?: number,
) {
  switch (category) {
    case 'Casa':
      return <Icon name="home" color={color} size={size} />;
    case 'Salário':
      return <Icon name="dollar-sign" color={color} size={size} />;
    case 'Benefício':
      return <Icon name="dollar-sign" color={color} size={size} />;
    case 'Transferência':
      return <Icon name="dollar-sign" color={color} size={size} />;
    case 'Lazer':
      return <Icon name="trash" color={color} size={size} />;
    case 'Transporte':
      return <Icon name="trash" color={color} size={size} />;
    case 'Educação':
      return <Icon name="trash" color={color} size={size} />;
    case 'Comunicação':
      return <Icon name="trash" color={color} size={size} />;
    case 'Saúde':
      return <Icon name="trash" color={color} size={size} />;
    case 'Outro':
      return <Icon name="dollar-sign" color={color} size={size} />;
    default:
      return <Icon name="dollar-sign" color={color} size={size} />;
  }
}
