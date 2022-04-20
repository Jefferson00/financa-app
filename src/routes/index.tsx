import React from 'react';
import { useAuth } from '../hooks/AuthContext';
import AuthRoutes from './auth.routes';
import AppRoutes from './app.routes';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import SecurityAccess from '../pages/SecurityAccess';
import { useSecurity } from '../hooks/SecurityContext';

export type Nav = {
  navigate: (value: string, props?: any) => void;
  goBack: () => void;
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
        }}>
        <ActivityIndicator size="large" color="#F43434" />
      </View>
    );
  }

  if (!hasAuthenticated && securityEnabled) {
    return <SecurityAccess />;
  }

  return user ? <AuthRoutes /> : <AppRoutes />;
}
