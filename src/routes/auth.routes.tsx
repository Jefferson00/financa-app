import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';

const App = createSharedElementStackNavigator();

export default function AuthRoutes() {
  return (
    <App.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#ffffff',
        },
      }}>
      <App.Screen name="Home" component={Home} />
      <App.Screen
        name="Profile"
        component={Profile}
        sharedElements={route => {
          return [{ id: route.params.id, animation: 'fade', resize: 'clip' }];
        }}
      />
    </App.Navigator>
  );
}
