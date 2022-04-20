import React, { useEffect, useRef, useState } from 'react';
import { Colors } from '../../styles/global';
import * as S from './styles';

import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../hooks/ThemeContext';
import ReactNativePinView from 'react-native-pin-view';
import LogoImg from '../../assets/Logos/logoLogin.png';

import {
  useAnimatedStyle,
  withTiming,
  useDerivedValue,
  interpolateColor,
} from 'react-native-reanimated';
import { ScrollView } from 'react-native';
import { useSecurity } from '../../hooks/SecurityContext';

export default function SecurityAccess() {
  const { theme } = useTheme();
  const { handleAuth, handlePinAccess, errorPinAccess } = useSecurity();
  const pinView = useRef<any>(null);

  const [showCompletedButton, setShowCompletedButton] = useState(false);
  const [showRemoveButton, setShowRemoveButton] = useState(false);
  const [code, setCode] = useState('');

  const inputBackground =
    theme === 'dark' ? Colors.BLUE_SOFT_DARKER : Colors.BLUE_SOFT_LIGHTER;
  const inputFillBackground = theme === 'dark' ? '#d2d2d2' : '#fff';

  const progress = useDerivedValue(() => {
    return theme === 'dark'
      ? withTiming(1, { duration: 1000 })
      : withTiming(0, { duration: 1000 });
  }, [theme]);

  const colorAnimated = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      [Colors.BLUE_PRIMARY_LIGHTER, '#1C1C1C'],
    );

    return { backgroundColor };
  });

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
    <>
      <S.Container style={[colorAnimated]}>
        <ScrollView
          style={{ flex: 1, width: '100%' }}
          contentContainerStyle={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <S.Logo source={LogoImg} />

          {errorPinAccess && (
            <S.KeyboardText>Senha de acesso incorreto!</S.KeyboardText>
          )}
          <ReactNativePinView
            inputSize={20}
            //@ts-ignore
            ref={pinView}
            pinLength={6}
            buttonSize={50}
            onValueChange={value => setCode(value)}
            buttonAreaStyle={{
              marginTop: 16,
            }}
            inputAreaStyle={{
              marginBottom: 0,
            }}
            inputViewEmptyStyle={{
              backgroundColor: 'transparent',
              borderWidth: 1,
              borderColor: inputBackground,
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
                handlePinAccess(code);
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
                <Icon name={'log-in'} size={36} color={inputFillBackground} />
              ) : undefined
            }
          />

          <S.FingerPrint onPress={handleAuth}>
            <Icon name="finger-print" size={50} color="#fff" />
          </S.FingerPrint>
        </ScrollView>
      </S.Container>
    </>
  );
}
