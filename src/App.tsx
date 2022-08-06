import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'react-native';

import Routes from './routes';
import { NavigationContainer } from '@react-navigation/native';
import AppProvider from './hooks';
import { Provider } from 'react-redux';
import store from './store';

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar
          barStyle="dark-content"
          translucent
          backgroundColor="transparent"
        />
        <AppProvider>
          <Routes />
        </AppProvider>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
