import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../pages/Home';

const App = createStackNavigator();

export default function AuthRoutes() {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#ffffff',
        },
      }}>
      <App.Screen name="Home" component={Home} />
    </App.Navigator>
  );
}
