import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import AsyncStorage from '@react-native-community/async-storage';
import GoogleSignin from '../config/GoogleSignIn';
import api from '../services/api';
import { HeadersDefaults } from 'axios';
import { useNavigation } from '@react-navigation/native';

interface CommonHeaderProperties extends HeadersDefaults {
  authorization: string;
}

interface IUser {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  phone: string | null;
}

interface AuthContextData {
  user: IUser | null;
  loading: boolean;
  signInGoogle: () => Promise<void>;
  confirmCode: (code: any) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const navigation = useNavigation();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const { displayName, photoURL, email, phoneNumber, uid } = user;

        /* if (!displayName) {
          throw new Error('Missing information from Google Account.');
        } */

        const token = await user.getIdToken();

        await AsyncStorage.setItem('@FinancaAppBeta:token', token);

        api.defaults.headers = {
          authorization: `Bearer ${token}`,
        } as CommonHeaderProperties;

        setUser({
          id: uid,
          avatar: photoURL,
          email: email,
          name: displayName,
          phone: phoneNumber,
        });
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signInGoogle = useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const { idToken } = await GoogleSignin.signIn();
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      const userCredential = await auth().signInWithCredential(
        googleCredential,
      );

      const user = userCredential.user;

      const token = await user.getIdToken();

      if (user.email && user.displayName) {
        await AsyncStorage.setItem('@FinancaAppBeta:token', token);
        setUser({
          id: user.uid,
          avatar: user.photoURL,
          email: user.email,
          name: user.displayName,
          phone: user.phoneNumber,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  const confirmCode = useCallback(
    async (code: any) => {
      try {
        if (confirm) {
          const credential = auth.PhoneAuthProvider.credential(
            confirm.verificationId,
            code,
          );

          const userCredential = await auth().signInWithCredential(credential);

          const user = userCredential.user;

          const token = await user.getIdToken();

          console.log(token);

          await AsyncStorage.setItem('@FinancaAppBeta:token', token);
          setUser({
            id: user.uid,
            avatar: user.photoURL,
            email: user.email,
            name: user.displayName,
            phone: user.phoneNumber,
          });
        }
      } catch (error) {
        console.log(error);
      }
    },
    [confirm],
  );

  const signInWithPhone = useCallback(async (phoneNumber: string) => {
    try {
      console.log(phoneNumber);
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);

      navigation.navigate('Confirm');
    } catch (error) {
      console.log(error);
    }
  }, []);

  const signOut = useCallback(async () => {
    setUser(null);
    await auth().signOut();
    await AsyncStorage.removeItem('@FinancaAppBeta:token');
  }, []);

  return (
    <AuthContext.Provider
      value={{
        signInGoogle,
        signOut,
        signInWithPhone,
        confirmCode,
        loading,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextData {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
