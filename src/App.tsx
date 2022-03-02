import 'react-native-gesture-handler';
import React from 'react';
import { useColorScheme } from 'react-native';

import Routes from './routes';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './hooks';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <NavigationContainer>
      <AppProvider>
        <Routes />
      </AppProvider>
    </NavigationContainer>
  );
};

export default App;
