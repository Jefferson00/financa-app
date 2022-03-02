import React, { useCallback, useState } from 'react';
import * as S from './styles';
import { Colors } from '../../../styles/global';

import LogoImg from '../../../assets/Logos/logoLogin.png';
import Button from '../../../components/Button';
import Icons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../hooks/AuthContext';
import Input from '../../../components/Input';
import { KeyboardAvoidingView, Platform } from 'react-native';

export default function PhoneLogin() {
  const { signInGoogle, signInWithPhone, confirmCode } = useAuth();
  const [code, setCode] = useState('');

  const GmailIcon = () => {
    return <Icons name="logo-google" size={24} color="#fff" />;
  };
  const SignInIcon = () => {
    return <Icons name="log-in-outline" size={24} color="#fff" />;
  };

  const titleColor = Colors.MAIN_TEXT_TITLE_LIGHTER;
  const textColor = Colors.MAIN_TEXT_LIGHTER;
  const inputBackground = Colors.BLUE_SOFT_LIGHTER;

  const buttonColors = {
    PRIMARY_BACKGROUND: Colors.ORANGE_SECONDARY_LIGHTER,
    SECOND_BACKGROUND: Colors.ORANGE_PRIMARY_LIGHTER,
    TEXT: '#fff',
  };

  return (
    <S.Container>
      <S.KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <S.Header background={Colors.BLUE_PRIMARY_LIGHTER}>
          <S.Logo source={LogoImg} />
        </S.Header>

        <S.MainContainer>
          <S.HeaderContent>
            <S.Title>Informe seu número</S.Title>
            <S.Title>
              <Icons name="log-in-outline" size={24} />
            </S.Title>
          </S.HeaderContent>

          <S.Form>
            <Input
              background={inputBackground}
              textColor={textColor}
              placeholder="(99) 9 9999-9999"
              onChangeText={e => setCode(e)}
            />
            <Button
              title="Enviar SMS"
              colors={buttonColors}
              icon={SignInIcon}
              onPress={() => signInWithPhone()}
            />
            <Button
              title="Confirmar"
              colors={buttonColors}
              icon={SignInIcon}
              onPress={() => confirmCode(code)}
            />
          </S.Form>

          <Button
            title="Entrar com Gmail"
            colors={buttonColors}
            icon={GmailIcon}
            onPress={() => signInGoogle()}
          />
        </S.MainContainer>
      </S.KeyboardAvoidingView>
    </S.Container>
  );
}
