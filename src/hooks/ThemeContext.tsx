import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

type ColorSchemeName = 'light' | 'dark' | null | undefined;

interface ThemeContextData {
  theme: ColorSchemeName;
  defaultDeviceThemeEnable: boolean;
  handleChangeTheme: (theme: ColorSchemeName) => Promise<void>;
  handleToggleDefaultThemeEnable: () => Promise<void>;
}

export const ThemeContext = createContext<ThemeContextData>(
  {} as ThemeContextData,
);

export const ThemeProvider: React.FC = ({ children }) => {
  const colorScheme = useColorScheme();
  const [theme, setTheme] = useState<ColorSchemeName>(null);
  const [defaultDeviceThemeEnable, setDefaultDeviceThemeEnable] =
    useState(false);

  const handleChangeTheme = useCallback(async (theme: ColorSchemeName) => {
    setTheme(theme);
    await AsyncStorage.setItem('@FinancaAppBeta:theme', String(theme));
  }, []);

  const handleToggleDefaultThemeEnable = useCallback(async () => {
    setDefaultDeviceThemeEnable(!defaultDeviceThemeEnable);
    if (defaultDeviceThemeEnable) {
      await AsyncStorage.removeItem('@FinancaAppBeta:defaultDeviceThemeEnable');
    } else {
      await AsyncStorage.setItem(
        '@FinancaAppBeta:defaultDeviceThemeEnable',
        String(!defaultDeviceThemeEnable),
      );
    }
  }, [defaultDeviceThemeEnable]);

  useEffect(() => {
    const unsubscribe = async () => {
      const storegedTheme = await AsyncStorage.getItem('@FinancaAppBeta:theme');
      const defaultEnable = await AsyncStorage.getItem(
        '@FinancaAppBeta:defaultDeviceThemeEnable',
      );
      if (storegedTheme) {
        setTheme(storegedTheme as ColorSchemeName);
      } else {
        setTheme(colorScheme);
      }
      setDefaultDeviceThemeEnable(
        defaultEnable ? Boolean(defaultEnable) : false,
      );
    };

    unsubscribe();
  }, [colorScheme]);

  /*   useEffect(() => {
    console.log(theme);
  }, [theme]);

  useEffect(() => {
    console.log(defaultDeviceThemeEnable);
  }, [defaultDeviceThemeEnable]); */

  return (
    <ThemeContext.Provider
      value={{
        theme,
        defaultDeviceThemeEnable,
        handleChangeTheme,
        handleToggleDefaultThemeEnable,
      }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useTheme(): ThemeContextData {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within an ThemeProvider');
  }
  return context;
}
