import React from 'react';

import { AuthProvider } from './AuthContext';
import { SecurityProvider } from './SecurityContext';
import { ThemeProvider } from './ThemeContext';

const AppProvider: React.FC = ({ children }) => (
  <SecurityProvider>
    <ThemeProvider>
      <AuthProvider>{children}</AuthProvider>
    </ThemeProvider>
  </SecurityProvider>
);

export default AppProvider;
