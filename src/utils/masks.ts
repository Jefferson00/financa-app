import { Mask, createNumberMask } from 'react-native-mask-input';

export const maskPhone = (value: string) =>
  value
    .replace(/\D/g, '')
    .replace(/^(\d{2})(\d)/g, '($1) $2')
    .replace(/(\d)(\d{4})$/, '$1-$2');

export const phoneMask: Mask = [
  '(',
  /\d/,
  /\d/,
  ')',
  ' ',
  /\d/,
  ' ',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
  '-',
  /\d/,
  /\d/,
  /\d/,
  /\d/,
];

export const priceMask = (value: string) => {
  let maskedPrice = value.replace(/\D/g, '');
  maskedPrice = `${(Number(maskedPrice) / 100).toFixed(2)}`;
  maskedPrice = maskedPrice.replace('.', ',');
  maskedPrice = maskedPrice.replace(/(\d)(\d{3})(\d{3}),/g, '$1.$2.$3,');
  maskedPrice = maskedPrice.replace(/(\d)(\d{3}),/g, '$1.$2,');
  maskedPrice = `R$ ${maskedPrice}`;
  return maskedPrice;
};

export const currencyToValue = (value: string) => {
  return value
    .split('R$')[1]
    .replace(/\D/g, '')
    .replace(',', '')
    .replace('.', '');
};
