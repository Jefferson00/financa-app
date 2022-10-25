import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
      return <Icon name="currency-usd" color={color} size={size} />;
    case 'Benefício':
      return <Icon name="cash-multiple" color={color} size={size} />;
    case 'Transferência':
      return <Icon name="bank-transfer" color={color} size={size} />;
    case 'Lazer':
      return <Icon name="drama-masks" color={color} size={size} />;
    case 'Transporte':
      return <Icon name="bus" color={color} size={size} />;
    case 'Educação':
      return <Icon name="school" color={color} size={size} />;
    case 'Comunicação':
      return <Icon name="phone" color={color} size={size} />;
    case 'Alimentação':
      return <Icon name="food" color={color} size={size} />;
    case 'Saúde':
      return <Icon name="medical-bag" color={color} size={size} />;
    case 'Outro':
      return <Icon name="account-cash-outline" color={color} size={size} />;
    default:
      return <Icon name="currency-usd" color={color} size={size} />;
  }
}
