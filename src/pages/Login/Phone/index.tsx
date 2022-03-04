import React, { useState } from 'react';
import * as S from './styles';
import { Colors } from '../../../styles/global';

import LogoImg from '../../../assets/Logos/logoLogin.png';
import Button from '../../../components/Button';
import Icons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../hooks/AuthContext';
import Input from '../../../components/Input';
import { Platform } from 'react-native';
import { Mask } from 'react-native-mask-input';
import Loading from '../../../components/Loading';

export default function PhoneLogin() {
  const { signInGoogle, signInWithPhone, isSubmitting } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState('');

  const GmailIcon = () => {
    return <Icons name="logo-google" size={24} color="#fff" />;
  };
  const SignInIcon = () => {
    return <Icons name="chevron-forward-outline" size={24} color="#fff" />;
  };

  const textColor = Colors.MAIN_TEXT_LIGHTER;
  const inputBackground = Colors.BLUE_SOFT_LIGHTER;

  const phoneButtonColors = {
    PRIMARY_BACKGROUND: Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND: Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: '#fff',
  };

  const googleButtonColors = {
    PRIMARY_BACKGROUND: Colors.ORANGE_SECONDARY_LIGHTER,
    SECOND_BACKGROUND: Colors.ORANGE_PRIMARY_LIGHTER,
    TEXT: '#fff',
  };

  const phoneMask: Mask = [
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

  return (
    <S.Container>
      <Loading isLoading={isSubmitting} />
      <S.KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <S.ScrollView keyboardShouldPersistTaps="handled">
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
                keyboardType="phone-pad"
                onChangeText={e => setPhoneNumber(e)}
                value={phoneNumber}
                mask={phoneMask}
              />
              <Button
                title="Enviar SMS"
                colors={phoneButtonColors}
                icon={SignInIcon}
                disabled={phoneNumber.length < 16}
                onPress={() => signInWithPhone(`+55 ${phoneNumber}`)}
                style={{ marginTop: 16 }}
              />
            </S.Form>

            <Button
              title="Entrar com Gmail"
              colors={googleButtonColors}
              icon={GmailIcon}
              onPress={() => signInGoogle()}
            />
          </S.MainContainer>
        </S.ScrollView>
      </S.KeyboardAvoidingView>
    </S.Container>
  );
}
