import React from 'react';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import EditProfile from '../pages/EditProfile';
import { createSharedElementStackNavigator } from 'react-navigation-shared-element';
import ThemeScreen from '../pages/ThemeScreen';
import { useTheme } from '../hooks/ThemeContext';
import SecurityScreen from '../pages/SecurityScreen';
import Account from '../pages/Account';
import Incomes from '../pages/Incomes';
import CreateIncome from '../pages/Incomes/CreateIncome';
import Expanses from '../pages/Expanses';
import CreateExpanse from '../pages/Expanses/CreateExpanse';
import CreateCreditCard from '../pages/Expanses/CreateCreditCard';

const App = createSharedElementStackNavigator();

export default function AuthRoutes() {
  const { theme } = useTheme();

  return (
    <App.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        cardStyle: {
          backgroundColor: theme === 'dark' ? '#1C1C1C' : '#fff',
        },
      }}>
      <App.Screen name="Home" component={Home} />
      <App.Screen name="Account" component={Account} />
      <App.Screen name="Expanses" component={Expanses} />
      <App.Screen name="Incomes" component={Incomes} />
      <App.Screen name="CreateIncome" component={CreateIncome} />
      <App.Screen name="CreateExpanse" component={CreateExpanse} />
      <App.Screen name="CreateCreditCard" component={CreateCreditCard} />
      <App.Screen
        name="Profile"
        component={Profile}
        sharedElements={route => {
          return [{ id: route.params.id, animation: 'fade', resize: 'clip' }];
        }}
      />
      <App.Screen name="EditProfile" component={EditProfile} />
      <App.Screen name="ThemeScreen" component={ThemeScreen} />
      <App.Screen name="SecurityScreen" component={SecurityScreen} />
    </App.Navigator>
  );
}
