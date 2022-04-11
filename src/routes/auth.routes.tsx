import React from 'react';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
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
      <App.Screen name="EditProfile" component={EditProfile} />
    </App.Navigator>
  );
}
