import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { Image, StatusBar, View } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import SecurityAccess from '../pages/SecurityAccess';
import { useSecurity } from '../hooks/SecurityContext';
import LottieView from 'lottie-react-native';
import LogoImg from '../assets/Logos/logoLogin.png';

export type Nav = {
  navigate: (value: string, props?: any) => void;
  goBack: () => void;
  isFocused: () => boolean;
};

export default function Routes() {
  const { user, loading } = useAuth();
  const { theme } = useTheme();
  const { hasAuthenticated, securityEnabled } = useSecurity();

  if (loading || !theme) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
        }}>
        <LottieView
          source={require('../assets/splash.json')}
          autoPlay
          loop
          style={{ width: '100%' }}
        />
        <Image source={LogoImg} style={{ position: 'absolute' }} />
      </View>
    );
  }

  if (!hasAuthenticated && securityEnabled) {
    return <SecurityAccess />;
  }

  return user ? (
    <>
      <StatusBar translucent barStyle="light-content" />
      <AuthRoutes />
    </>
  ) : (
    <AppRoutes />
  );
}
