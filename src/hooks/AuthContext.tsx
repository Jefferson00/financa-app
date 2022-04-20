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
import { Nav } from '../routes';

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
  isSubmitting: boolean;
  authError: any;
  signInGoogle: () => Promise<void>;
  confirmCode: (code: any) => Promise<void>;
  signInWithPhone: (phoneNumber: string) => Promise<void>;
  signOut: () => Promise<void>;
  closeErrorModal: () => void;
  updateUser: (user: any) => void;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);

export const AuthProvider: React.FC = ({ children }) => {
  const navigation = useNavigation<Nav>();
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirm, setConfirm] =
    useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(async user => {
      if (user) {
        const { displayName, photoURL, email, phoneNumber, uid } = user;

        const token = await user.getIdToken();

        await AsyncStorage.setItem('@FinancaAppBeta:token', token);

        const userInput = {
          avatar: photoURL,
          email: email,
          name: displayName,
          phone: phoneNumber,
        };

        api.defaults.headers = {
          authorization: `Bearer ${token}`,
        } as CommonHeaderProperties;

        api
          .get('users')
          .then(({ data }) => {
            const user = data.find(
              (u: IUser) =>
                (email && u.email === email) ||
                (phoneNumber && u.phone === phoneNumber),
            );
            // console.log('user: ', user);
            if (!user) {
              api
                .post('users', userInput)
                .then(({ data }) => {
                  setUser({
                    ...data,
                    phone: data.phone.replace('+55', ''),
                  });
                  return;
                })
                .catch(err => console.log('erro ao criar:', err))
                .finally(() => setLoading(false));
            }
            setUser({
              ...user,
              phone: user.phone.replace('+55', ''),
            });
          })
          .catch(err => console.log('erro ao listar: ', err))
          .finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const closeErrorModal = useCallback(() => {
    setAuthError(null);
  }, []);

  const updateUser = useCallback(user => {
    setUser(user);
  }, []);

  const signInGoogle = useCallback(async () => {
    setIsSubmitting(true);
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
      setAuthError(error as any);
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  const confirmCode = useCallback(
    async (code: any) => {
      setIsSubmitting(true);
      try {
        if (confirm) {
          const credential = auth.PhoneAuthProvider.credential(
            confirm.verificationId,
            code,
          );

          const userCredential = await auth().signInWithCredential(credential);

          const user = userCredential.user;

          const token = await user.getIdToken();

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
        setAuthError(error as any);
      } finally {
        setIsSubmitting(false);
      }
    },
    [confirm],
  );

  const signInWithPhone = useCallback(async (phoneNumber: string) => {
    setIsSubmitting(true);
    try {
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
      setConfirm(confirmation);

      navigation.navigate('Confirm');
    } catch (error) {
      setAuthError(error as any);
    } finally {
      setIsSubmitting(false);
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
        closeErrorModal,
        signInGoogle,
        signOut,
        signInWithPhone,
        confirmCode,
        updateUser,
        authError,
        loading,
        isSubmitting,
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
