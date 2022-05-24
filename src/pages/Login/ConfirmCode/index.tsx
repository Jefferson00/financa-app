import React, { useEffect, useRef, useState } from 'react';
import * as S from './styles';
import { Colors } from '../../../styles/global';
import { RFPercentage } from 'react-native-responsive-fontsize';

import LogoImg from '../../../assets/Logos/logoLogin.png';
import Button from '../../../components/Button';
import Icons from 'react-native-vector-icons/Ionicons';
import { useAuth } from '../../../hooks/AuthContext';
import { Platform } from 'react-native';
import ReactNativePinView from 'react-native-pin-view';
import ModalComponent from '../../../components/Modal';

export default function ConfirmCodeLogin() {
  const pinView = useRef<any>(null);
  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const { confirmCode, isSubmitting, authError, closeErrorModal } = useAuth();
  const [code, setCode] = useState('');

  const SignInIcon = () => {
    return <Icons name="log-in-outline" size={24} color="#fff" />;
  };

  const inputFillBackground = Colors.BLUE_PRIMARY_LIGHTER;
  const inputBackground = Colors.BLUE_SOFT_LIGHTER;

  const phoneButtonColors = {
    PRIMARY_BACKGROUND: Colors.BLUE_PRIMARY_LIGHTER,
    SECOND_BACKGROUND: Colors.BLUE_SECONDARY_LIGHTER,
    TEXT: '#fff',
  };

  useEffect(() => {
    if (code.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (code.length === 6) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [code]);

  return (
    <S.Container>
      <S.KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <S.Header background={Colors.BLUE_PRIMARY_LIGHTER}>
          <S.Logo source={LogoImg} />
        </S.Header>

        <S.MainContainer>
          <S.HeaderContent>
            <S.Title>Informe o código de validação</S.Title>
          </S.HeaderContent>

          <S.Form>
            <ReactNativePinView
              showInputText={true}
              inputSize={RFPercentage(4)}
              inputViewStyle={{
                borderRadius: 0,
              }}
              //@ts-ignore
              ref={pinView}
              pinLength={6}
              buttonSize={RFPercentage(5)}
              onValueChange={value => setCode(value)}
              buttonAreaStyle={{
                marginTop: 0,
              }}
              inputAreaStyle={{
                marginBottom: RFPercentage(5),
              }}
              inputViewEmptyStyle={{
                backgroundColor: inputBackground,
              }}
              inputViewFilledStyle={{
                backgroundColor: inputFillBackground,
              }}
              buttonTextStyle={{
                color: inputFillBackground,
              }}
              onButtonPress={key => {
                if (key === 'custom_left' && pinView.current) {
                  pinView.current.clear();
                }
                if (key === 'custom_right') {
                  confirmCode(code);
                }
              }}
              //@ts-ignore
              customLeftButton={
                showRemoveButton ? (
                  <Icons
                    name={'backspace'}
                    size={36}
                    color={inputFillBackground}
                  />
                ) : undefined
              }
              //@ts-ignore
              customRightButton={
                showCompletedButton ? (
                  <Icons
                    name={'log-in'}
                    size={36}
                    color={inputFillBackground}
                  />
                ) : undefined
              }
            />
            <Button
              title="Confirmar"
              colors={phoneButtonColors}
              icon={SignInIcon}
              disabled={code.length < 6}
              onPress={() => confirmCode(code)}
            />
          </S.Form>
        </S.MainContainer>
        <ModalComponent
          type="loading"
          visible={isSubmitting}
          transparent
          title="Validando..."
          animationType="slide"
        />
        <ModalComponent
          type="error"
          visible={!!authError}
          handleCancel={closeErrorModal}
          onRequestClose={closeErrorModal}
          transparent
          title="Erro ao validar código"
          subtitle="Verfique o código e tente novamente"
          animationType="slide"
        />
      </S.KeyboardAvoidingView>
    </S.Container>
  );
}
