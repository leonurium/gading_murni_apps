import {Platform} from 'react-native';

/**
 * Firebase Configuration for iOS
 */
export const IOS_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBORYNwt8WzJ3WL4xPh4Q_4zjSeb7WThA0',
  projectId: 'gading-murni-app',
  storageBucket: 'gading-murni-app.firebasestorage.app',
  messagingSenderId: '1042473916771',
  appId: '1:1042473916771:ios:e2ea1c626c9ce8390a1b56',
  databaseURL: 'https://gading-murni-app.firebaseio.com',
};

/**
 * Firebase Configuration for Android
 * Add your Android Firebase config here when needed
 */
export const ANDROID_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyAtD859jl86NhtOw3491QueRlF2fx1ArzI',
  projectId: 'gading-murni-476e7',
  storageBucket: 'gading-murni-476e7.appspot.com',
  messagingSenderId: '406757309596',
  appId: '1:406757309596:android:2d29c268a7395116dcc159',
  databaseURL: 'https://gading-murni-476e7.firebaseio.com',
};

/**
 * Get platform-specific Firebase configuration
 * @returns {Object} Firebase configuration object
 */
export const getFirebaseConfig = () => {
  switch (Platform.OS) {
    case 'ios':
      return IOS_FIREBASE_CONFIG;
    case 'android':
      return ANDROID_FIREBASE_CONFIG;
    default:
      throw new Error(`Unsupported platform: ${Platform.OS}`);
  }
};

/**
 * Validate Firebase configuration
 * @param {Object} config - Firebase configuration object
 * @returns {boolean} True if configuration is valid
 */
export const validateFirebaseConfig = (config) => {
  if (!config || typeof config !== 'object') {
    return false;
  }

  const requiredFields = ['apiKey', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
  
  return requiredFields.every(field => {
    const value = config[field];
    return value && typeof value === 'string' && value.trim().length > 0;
  });
};

/**
 * Firebase configuration constants
 */
export const FIREBASE_CONSTANTS = {
  // Notification channels
  NOTIFICATION_CHANNELS: {
    HIGH_PRIORITY: {
      id: 'high-priority',
      name: 'High Priority',
      description: 'High priority notifications',
      importance: 'high',
      sound: 'default',
      vibrate: true,
    },
    DEFAULT: {
      id: 'default',
      name: 'Default',
      description: 'Default notifications',
      importance: 'default',
      sound: 'default',
      vibrate: false,
    },
  },
  
  // Error codes
  ERROR_CODES: {
    MESSAGING_NOT_REGISTERED: 'messaging/not-registered',
    MESSAGING_PERMISSION_DENIED: 'messaging/permission-denied',
    MESSAGING_NETWORK_ERROR: 'messaging/network-error',
    MESSAGING_SERVER_ERROR: 'messaging/server-error',
    MESSAGING_TIMEOUT: 'messaging/timeout',
  },
  
  // Permission status
  PERMISSION_STATUS: {
    AUTHORIZED: 'authorized',
    DENIED: 'denied',
    PROVISIONAL: 'provisional',
    UNAUTHORIZED: 'unauthorized',
  },
};

export default {
  getFirebaseConfig,
  validateFirebaseConfig,
  FIREBASE_CONSTANTS,
  IOS_FIREBASE_CONFIG,
  ANDROID_FIREBASE_CONFIG,
};
