import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Login from '../pages/Login';
import PhoneLogin from '../pages/Login/Phone';

const App = createStackNavigator();

export default function AppRoutes() {
  return (
    <App.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: '#ffffff',
        },
      }}>
      <App.Screen name="Login" component={Login} />
      <App.Screen name="Phone" component={PhoneLogin} />
    </App.Navigator>
  );
}
