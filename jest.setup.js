// Jest setup file for React Native testing

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
    select: jest.fn((obj) => obj.ios),
  },
  PermissionsAndroid: {
    PERMISSIONS: {
      POST_NOTIFICATIONS: 'android.permission.POST_NOTIFICATIONS',
    },
    request: jest.fn(),
  },
  Alert: {
    alert: jest.fn(),
  },
}));

// Mock @react-native-firebase/app
jest.mock('@react-native-firebase/app', () => ({
  __esModule: true,
  default: {
    apps: [],
    initializeApp: jest.fn(),
  },
}));

// Mock @react-native-firebase/messaging
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: () => ({
    getToken: jest.fn(),
    deleteToken: jest.fn(),
    onMessage: jest.fn(),
    setBackgroundMessageHandler: jest.fn(),
    hasPermission: jest.fn(),
    requestPermission: jest.fn(),
    AuthorizationStatus: {
      AUTHORIZED: 'authorized',
      DENIED: 'denied',
      PROVISIONAL: 'provisional',
      UNAUTHORIZED: 'unauthorized',
    },
  }),
}));

// Mock @react-native-community/push-notification-ios
jest.mock('@react-native-community/push-notification-ios', () => ({
  __esModule: true,
  default: {
    FetchResult: {
      NoData: 'no-data',
    },
  },
}));

// Mock react-native-push-notification
jest.mock('react-native-push-notification', () => ({
  __esModule: true,
  default: {
    configure: jest.fn(),
    createChannel: jest.fn(),
    localNotification: jest.fn(),
  },
}));

// Mock navigation service
jest.mock('./src/navigations/navigationService', () => ({
  navigationRef: {
    navigate: jest.fn(),
    getRootState: jest.fn(() => ({})),
  },
}));

// Mock store
jest.mock('./src/store/store', () => ({
  store: {
    getState: jest.fn(() => ({
      user: {
        userType: 'CUSTOMER',
      },
    })),
  },
  persistor: {},
}));

// Global test utilities
global.console = {
  ...console,
  // Uncomment to ignore console.log during tests
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  // warn: jest.fn(),
  // error: jest.fn(),
};
