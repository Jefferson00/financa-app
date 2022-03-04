import React from 'react';
import { Text } from 'react-native';
import * as S from './styles';

interface LoadingProps {
  isLoading: boolean;
}

export default function Loading({ isLoading }: LoadingProps) {
  return (
    <S.Container isLoading={isLoading}>
      <Text>carregando...</Text>
    </S.Container>
  );
}
