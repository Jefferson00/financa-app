import React from 'react';
import * as ReactNative from 'react-native';
import { render } from '@testing-library/react-native';
import { NativeModules } from 'react-native';

import Home from './index';

jest.doMock('react-native', () => {
  return Object.setPrototypeOf(
    {
      Platform: {
        OS: 'android',
        select: () => {},
      },
      NativeModules: {
        ...ReactNative.NativeModules,
        RNFBAnalyticsModule: {
          logEvent: jest.fn(),
        },
        RNFBAppModule: {
          NATIVE_FIREBASE_APPS: [
            {
              appConfig: {
                name: '[DEFAULT]',
              },
              options: {},
            },

            {
              appConfig: {
                name: 'secondaryFromNative',
              },
              options: {},
            },
          ],
          addListener: jest.fn(),
          eventsAddListener: jest.fn(),
          eventsNotifyReady: jest.fn(),
          removeListeners: jest.fn(),
        },
        RNFBAuthModule: {
          APP_LANGUAGE: {
            '[DEFAULT]': 'en-US',
          },
          APP_USER: {
            '[DEFAULT]': 'jestUser',
          },
          addAuthStateListener: jest.fn(),
          addIdTokenListener: jest.fn(),
          useEmulator: jest.fn(),
        },
        RNFBMessagingModule: {
          onMessage: jest.fn(),
        },
        RNCAsyncStorage: {
          getItem: jest.fn(),
          setItem: jest.fn(),
          removeItem: jest.fn(),
          mergeItem: jest.fn(),
          clear: jest.fn(),
          getAllKeys: jest.fn(),
          flushGetRequests: jest.fn(),
          multiGet: jest.fn(),
          multiSet: jest.fn(),
          multiRemove: jest.fn(),
          multiMerge: jest.fn(),
        },
        RNGoogleSignin: {
          BUTTON_SIZE_ICON: 0,
          BUTTON_SIZE_STANDARD: 0,
          BUTTON_SIZE_WIDE: 0,
          BUTTON_COLOR_AUTO: 0,
          BUTTON_COLOR_LIGHT: 0,
          BUTTON_COLOR_DARK: 0,
          SIGN_IN_CANCELLED: '0',
          IN_PROGRESS: '1',
          PLAY_SERVICES_NOT_AVAILABLE: '2',
          SIGN_IN_REQUIRED: '3',
          configure: jest.fn(),
          currentUserAsync: jest.fn(),
        },
      },
    },
    ReactNative,
  );
});

jest.mock('@react-native-community/async-storage', () =>
  require('@react-native-community/async-storage/jest/async-storage-mock'),
);

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('@react-native-community/async-storage', () =>
  require('@react-native-community/async-storage/jest/async-storage-mock'),
);
/* 
jest.mock('@react-native-google-signin/google-signin', () => {
  const mockGoogleSignin = jest.requireActual(
    '@react-native-google-signin/google-signin',
  );

  mockGoogleSignin.GoogleSignin.hasPlayServices = () => Promise.resolve(true);
  mockGoogleSignin.GoogleSignin.configure = () => Promise.resolve();
  mockGoogleSignin.GoogleSignin.getCurrentUser = () => {
    return Promise.resolve({
      name: 'name',
      email: 'test@example.com',
      // .... other user data
    });
  };
  mockGoogleSignin.statusCodes.SIGN_IN_CANCELLED = '0';
  mockGoogleSignin.statusCodes.IN_PROGRESS = '1';
  mockGoogleSignin.statusCodes.PLAY_SERVICES_NOT_AVAILABLE = '2';
  mockGoogleSignin.statusCodes.SIGN_IN_REQUIRED = '3';

  return mockGoogleSignin;
});

NativeModules.RNGoogleSignin = {
  BUTTON_SIZE_ICON: 0,
  BUTTON_SIZE_STANDARD: 0,
  BUTTON_SIZE_WIDE: 0,
  BUTTON_COLOR_AUTO: 0,
  BUTTON_COLOR_LIGHT: 0,
  BUTTON_COLOR_DARK: 0,
  SIGN_IN_CANCELLED: '0',
  IN_PROGRESS: '1',
  PLAY_SERVICES_NOT_AVAILABLE: '2',
  SIGN_IN_REQUIRED: '3',
  configure: jest.fn(),
  currentUserAsync: jest.fn(),
}; */

// est.mock('react-native-google-signin', () => {});

beforeAll(() => {
  jest.mock('@react-native-community/async-storage');

  jest.mock('@react-native-google-signin/google-signin', () => {
    const mockGoogleSignin = jest.requireActual(
      '@react-native-google-signin/google-signin',
    );

    mockGoogleSignin.GoogleSignin.hasPlayServices = () => Promise.resolve(true);
    mockGoogleSignin.GoogleSignin.configure = () => Promise.resolve();
    mockGoogleSignin.GoogleSignin.currentUserAsync = () => {
      return Promise.resolve({
        name: 'name',
        email: 'test@example.com',
        // .... other user data
      });
    };
    mockGoogleSignin.BUTTON_SIZE_ICON = 0;
    mockGoogleSignin.BUTTON_SIZE_STANDARD = 0;
    mockGoogleSignin.BUTTON_SIZE_WIDE = 0;
    mockGoogleSignin.BUTTON_COLOR_AUTO = 0;
    mockGoogleSignin.BUTTON_COLOR_LIGHT = 0;
    mockGoogleSignin.BUTTON_COLOR_DARK = 0;
    mockGoogleSignin.SIGN_IN_CANCELLED = '0';
    mockGoogleSignin.IN_PROGRESS = '1';
    mockGoogleSignin.PLAY_SERVICES_NOT_AVAILABLE = '2';
    mockGoogleSignin.SIGN_IN_REQUIRED = '3';

    // ... and other functions you want to mock

    return mockGoogleSignin;
  });
});

it('render home screen', () => {
  const { getByText } = render(<Home />);

  const text = getByText('Saldo atual');

  expect(text).toBeTruthy();
});
