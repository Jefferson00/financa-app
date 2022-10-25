import React from 'react';
import * as S from '../styles';
import { ColorsList } from '../../../utils/cardsColors';
import { ModalColors } from '..';
import { TouchableOpacity } from 'react-native';

interface ColorsProps {
  modalColors: ModalColors;
  handleSelectColor: (color: string) => void;
}

export function Colors({ modalColors, handleSelectColor }: ColorsProps) {
  return (
    <>
      <S.Text
        fontSize={2}
        fontWeight="SemiBold"
        color={modalColors().main_text}>
        Selecione a cor do cartão
      </S.Text>

      <S.SelectContent>
        {ColorsList &&
          ColorsList.map(color => (
            <S.SelectItem key={color.id}>
              <TouchableOpacity onPress={() => handleSelectColor(color.color)}>
                <S.ColorItem backgroundColor={color.color} />
              </TouchableOpacity>
            </S.SelectItem>
          ))}
      </S.SelectContent>
    </>
  );
}
