import React from 'react';
import { AccountProvider } from './AccountContext';

import { AuthProvider } from './AuthContext';
import { DateProvider } from './DateContext';
import { SecurityProvider } from './SecurityContext';
import { ThemeProvider } from './ThemeContext';

const AppProvider: React.FC = ({ children }) => (
  <SecurityProvider>
    <ThemeProvider>
      <AuthProvider>
        <DateProvider>
          <AccountProvider>{children}</AccountProvider>
        </DateProvider>
      </AuthProvider>
    </ThemeProvider>
  </SecurityProvider>
);

export default AppProvider;
