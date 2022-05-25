import AsyncStorage from '@react-native-community/async-storage';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import FingerprintScanner from 'react-native-fingerprint-scanner';

interface SecurityContextData {
  handleAuth: () => void;
  handlePinAccess: (pinAccess: string) => void;
  toggleEnableSecurity: () => Promise<void>;
  handleDefineSecurityPin: (pinAccess: string) => Promise<void>;
  verifyPinAccess: (pinAccess: string) => Promise<boolean>;
  closeAlertModal: () => void;
  errorPinAccess: boolean;
  hasAuthenticated: boolean;
  securityEnabled: boolean;
  hasPinAccess: boolean;
  alertModalVisible: boolean;
}

export const SecurityContext = createContext<SecurityContextData>(
  {} as SecurityContextData,
);

export const SecurityProvider: React.FC = ({ children }) => {
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [securityEnabled, setSecurityEnabled] = useState(false);
  const [errorPinAccess, setErrorPinAccess] = useState(false);
  const [hasPinAccess, setHasPinAccess] = useState(false);
  const [alertModalVisible, setAlertModalVisible] = useState(false);

  const handleAuth = () => {
    FingerprintScanner.authenticate({ onAttempt: err => console.log(err) })
      .then(() => {
        setHasAuthenticated(true);
      })
      .catch(error => {
        console.log(error);
      });
  };

  const closeAlertModal = () => {
    setAlertModalVisible(false);
  };

  const handlePinAccess = async (pinAccess: string) => {
    setErrorPinAccess(false);
    const pin = await AsyncStorage.getItem('@FinancaAppBeta:securityPin');
    if (pinAccess === pin) {
      setHasAuthenticated(true);
    } else {
      setErrorPinAccess(true);
    }
  };

  const verifyPinAccess = async (pinAccess: string) => {
    setErrorPinAccess(false);
    const pin = await AsyncStorage.getItem('@FinancaAppBeta:securityPin');
    if (pinAccess === pin) {
      return true;
    } else {
      return false;
    }
  };

  const handleDefineSecurityPin = async (pinAccess: string) => {
    await AsyncStorage.setItem('@FinancaAppBeta:securityPin', pinAccess);
  };

  const toggleEnableSecurity = async () => {
    const pin = await AsyncStorage.getItem('@FinancaAppBeta:securityPin');
    if (!pin) {
      setAlertModalVisible(true);
      return;
    }
    setHasAuthenticated(true);
    setSecurityEnabled(!securityEnabled);
    if (securityEnabled) {
      await AsyncStorage.removeItem('@FinancaAppBeta:securityEnabled');
    } else {
      await AsyncStorage.setItem(
        '@FinancaAppBeta:securityEnabled',
        String(!securityEnabled),
      );
    }
  };

  useEffect(() => {
    FingerprintScanner.release();
  }, []);

  useEffect(() => {
    const unsubscribe = async () => {
      const securityEnabledStoraged = await AsyncStorage.getItem(
        '@FinancaAppBeta:securityEnabled',
      );

      const hasStoragedPinAccess = await AsyncStorage.getItem(
        '@FinancaAppBeta:securityPin',
      );

      setSecurityEnabled(
        securityEnabledStoraged ? Boolean(securityEnabledStoraged) : false,
      );

      setHasPinAccess(hasStoragedPinAccess ? true : false);
    };

    unsubscribe();
  }, []);

  return (
    <SecurityContext.Provider
      value={{
        handleAuth,
        handlePinAccess,
        toggleEnableSecurity,
        handleDefineSecurityPin,
        verifyPinAccess,
        closeAlertModal,
        hasAuthenticated,
        errorPinAccess,
        securityEnabled,
        hasPinAccess,
        alertModalVisible,
      }}>
      {children}
    </SecurityContext.Provider>
  );
};

export function useSecurity(): SecurityContextData {
  const context = useContext(SecurityContext);

  if (!context) {
    throw new Error('useSecurity must be used within an SecurityProvider');
  }
  return context;
}
