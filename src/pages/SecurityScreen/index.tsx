import React, { useEffect, useRef, useState } from 'react';
import Menu from '../../components/Menu';
import { Colors } from '../../styles/global';
import * as S from './styles';

import Icon from 'react-native-vector-icons/Ionicons';
import Header from '../../components/Header';
import { useTheme } from '../../hooks/ThemeContext';
import ReactNativePinView from 'react-native-pin-view';

import {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native';
import { useSecurity } from '../../hooks/SecurityContext';
import ModalComponent from '../../components/Modal';

export default function SecurityScreen() {
  const { theme } = useTheme();
  const {
    toggleEnableSecurity,
    securityEnabled,
    handleDefineSecurityPin,
    hasPinAccess,
    verifyPinAccess,
  } = useSecurity();
  const defaultPinView = useRef<any>(null);
  const updatePinView = useRef<any>(null);

  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [firstEnteredPinComplete, setFirstEnteredPinComplete] = useState(false);
  const [hasAccess, setHasAccess] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const [isErrorModalVisible, setIsErrorModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [firstEnteredPin, setFirstEnteredPin] = useState('');
  const [comparePin, setComparePin] = useState('');
  const [pinAccess, setPinAcess] = useState('');
  const [pin, setPin] = useState('');

  const titleColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const textColor =
    theme === 'dark' ? Colors.MAIN_TEXT_DARKER : Colors.MAIN_TEXT_LIGHTER;
  const trackColor =
    theme === 'dark'
      ? Colors.BLUE_PRIMARY_DARKER
      : Colors.BLUE_SECONDARY_LIGHTER;
  const falseTrackColor = theme === 'dark' ? '#919191' : '#d2d2d2';
  const thumbColor =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;
  const falseThumbColor =
    theme === 'dark'
      ? Colors.BLUE_SECONDARY_LIGHTER
      : Colors.BLUE_SECONDARY_LIGHTER;
  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const inputFillBackground =
    theme === 'dark' ? Colors.BLUE_PRIMARY_DARKER : Colors.BLUE_PRIMARY_LIGHTER;

  const progress = useDerivedValue(() => {
    return theme === 'dark'
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [theme]);

  const colorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['#fff', '#1C1C1C'],
    );

    return { backgroundColor };
  });

  useEffect(() => {
    if (pin.length > 0 || pinAccess.length > 0) {
      setShowRemoveButton(true);
    } else {
      setShowRemoveButton(false);
    }
    if (pin.length === 6) {
      setShowCompletedButton(true);
    } else {
      setShowCompletedButton(false);
    }
  }, [pin]);

  useEffect(() => {
    if (pinAccess && pinAccess.length === 6) {
      verifyPinAccess(pinAccess).then(res => {
        setHasAccess(res);
        if (res) {
          updatePinView.current.clearAll();
          setPinAcess('');
        } else {
          setIsErrorModalVisible(true);
          setErrorMessage('Senha de acesso invalida.');
        }
      });
    }
  }, [pinAccess]);

  useEffect(() => {
    if (firstEnteredPinComplete) {
      setPin('');
    }
  }, [firstEnteredPinComplete]);

  useEffect(() => {
    if (firstEnteredPin && comparePin) {
      if (firstEnteredPin === comparePin) {
        handleDefineSecurityPin(comparePin);
        setIsSuccessModalVisible(true);
      } else {
        setIsErrorModalVisible(true);
        setErrorMessage('A combinação de senhas não combinam.');
      }
    }
  }, [firstEnteredPin, comparePin]);

  return (
    <>
      <Header reduced showMonthSelector={false} />
      <S.Container style={[colorAnimated]}>
        <ScrollView style={{ flex: 1, width: '100%' }}>
          <S.MainTitle color={titleColor}>Selecionar tema</S.MainTitle>

          <S.ConfigCard color={theme === 'dark' ? '#c5c5c5' : '#d2d2d2'}>
            <S.TextContainer>
              <S.Title color={textColor}>Proteção do aplicativo</S.Title>
              <S.Subtitle color={textColor}>
                Usar senha para acessar o aplicativo?
              </S.Subtitle>
            </S.TextContainer>
            <S.Switch
              trackColor={{ true: trackColor, false: falseTrackColor }}
              thumbColor={securityEnabled ? thumbColor : falseThumbColor}
              value={securityEnabled}
              onChange={toggleEnableSecurity}
            />
          </S.ConfigCard>

          <S.KeyboardContainer color={theme === 'dark' ? '#c5c5c5' : '#d2d2d2'}>
            {hasPinAccess && !hasAccess && (
              <S.KeyboardText color={textColor}>
                Insira a senha atual para alterar
              </S.KeyboardText>
            )}
            {((!hasPinAccess && !firstEnteredPinComplete) ||
              (hasAccess && !firstEnteredPinComplete)) && (
              <S.KeyboardText color={textColor}>
                Defina a senha de acesso
              </S.KeyboardText>
            )}
            {firstEnteredPinComplete && (
              <S.KeyboardText color={textColor}>
                Confirme a senha
              </S.KeyboardText>
            )}
            {!hasPinAccess || hasAccess ? (
              <ReactNativePinView
                inputSize={20}
                //@ts-ignore
                ref={defaultPinView}
                pinLength={6}
                buttonSize={50}
                onValueChange={value => setPin(value)}
                buttonAreaStyle={{
                  marginTop: 0,
                }}
                inputAreaStyle={{
                  marginBottom: 0,
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
                  if (key === 'custom_left' && defaultPinView.current) {
                    defaultPinView.current.clear();
                  }
                  if (key === 'custom_right') {
                    if (firstEnteredPin && firstEnteredPinComplete) {
                      setComparePin(pin);
                    } else {
                      setFirstEnteredPinComplete(true);
                      setFirstEnteredPin(pin);
                      defaultPinView.current.clearAll();
                    }
                  }
                }}
                //@ts-ignore
                customLeftButton={
                  showRemoveButton ? (
                    <Icon
                      name={'backspace'}
                      size={36}
                      color={inputFillBackground}
                    />
                  ) : undefined
                }
                //@ts-ignore
                customRightButton={
                  showCompletedButton ? (
                    <Icon
                      name={'log-in'}
                      size={36}
                      color={inputFillBackground}
                    />
                  ) : undefined
                }
              />
            ) : (
              <ReactNativePinView
                inputSize={20}
                //@ts-ignore
                ref={updatePinView}
                pinLength={6}
                buttonSize={50}
                onValueChange={value => setPinAcess(value)}
                buttonAreaStyle={{
                  marginTop: 0,
                }}
                inputAreaStyle={{
                  marginBottom: 0,
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
                  if (key === 'custom_left' && updatePinView.current) {
                    updatePinView.current.clear();
                  }
                  if (key === 'custom_right') {
                    if (hasAccess) {
                      updatePinView.current.clearAll();
                      setPinAcess('');
                    }
                  }
                }}
                //@ts-ignore
                customLeftButton={
                  showRemoveButton ? (
                    <Icon
                      name={'backspace'}
                      size={36}
                      color={inputFillBackground}
                    />
                  ) : undefined
                }
                //@ts-ignore
                customRightButton={
                  showCompletedButton ? (
                    <Icon
                      name={'log-in'}
                      size={36}
                      color={inputFillBackground}
                    />
                  ) : undefined
                }
              />
            )}
          </S.KeyboardContainer>
        </ScrollView>
        <ModalComponent
          type="success"
          visible={isSuccessModalVisible}
          transparent
          title="Senha definida com sucesso!"
          animationType="slide"
          handleCancel={() => setIsSuccessModalVisible(false)}
        />
        <ModalComponent
          type="error"
          visible={isErrorModalVisible}
          handleCancel={() => setIsErrorModalVisible(false)}
          onRequestClose={() => setIsErrorModalVisible(false)}
          transparent
          title={errorMessage}
          subtitle="Tente novamente mais tarde"
          animationType="slide"
        />
      </S.Container>
      <Menu />
    </>
  );
}
