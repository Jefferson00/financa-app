import React, { useCallback } from 'react';
import * as S from './styles';
import { Colors } from '../../styles/global';

import LogoImg from '../../assets/Logos/logoLogin.png';
import Button from '../../components/Button';
import Icons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/core';
import { useAuth } from '../../hooks/AuthContext';
import { Nav } from '../../routes';

export default function Login() {
  const navigation = useNavigation<Nav>();
  const { signInGoogle } = useAuth();

  const GmailIcon = () => {
    return <Icons name="logo-google" size={24} color="#fff" />;
  };
  const SignInIcon = () => {
    return <Icons name="log-in-outline" size={24} color="#fff" />;
  };

  const buttonColors = {
    PRIMARY_BACKGROUND: Colors.ORANGE_SECONDARY_LIGHTER,
    SECOND_BACKGROUND: Colors.ORANGE_PRIMARY_LIGHTER,
    TEXT: '#fff',
  };

  return (
    <S.Container background={Colors.BLUE_PRIMARY_LIGHTER}>
      <S.Logo source={LogoImg} />

      <S.Main>
        <S.MainText>Controle suas finanças de um jeito simples</S.MainText>
      </S.Main>

      <S.ButtonContainer>
        <Button
          title="Entrar"
          icon={GmailIcon}
          colors={buttonColors}
          onPress={() => signInGoogle()}
        />
        <Button
          title="Entrar com o celular"
          icon={SignInIcon}
          colors={{
            PRIMARY_BACKGROUND: 'transparent',
            SECOND_BACKGROUND: 'transparent',
            TEXT: '#fff',
          }}
          onPress={() => navigation.navigate('Phone')}
          testID="phone-login-button"
          fontSize="small"
        />
      </S.ButtonContainer>
    </S.Container>
  );
}
