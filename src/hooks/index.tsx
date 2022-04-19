import React from 'react';

import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './ThemeContext';

const AppProvider: React.FC = ({ children }) => (
  <ThemeProvider>
    <AuthProvider>{children}</AuthProvider>
  </ThemeProvider>
);

export default AppProvider;
