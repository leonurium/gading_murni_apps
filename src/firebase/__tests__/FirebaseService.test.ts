import {Platform} from 'react-native';
import FirebaseService from '../index';
import {getFirebaseConfig, validateFirebaseConfig} from '../config';

// Mock react-native
jest.mock('react-native', () => ({
  Platform: {
    OS: 'ios',
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

describe('FirebaseService', () => {
  beforeEach(() => {
    FirebaseService.reset();
    jest.clearAllMocks();
    
    // Reset the mock Firebase apps array
    const mockFirebase = require('@react-native-firebase/app').default;
    mockFirebase.apps = [];
  });

  describe('initialization', () => {
    it('should initialize Firebase successfully', async () => {
      const mockFirebase = require('@react-native-firebase/app').default;
      mockFirebase.initializeApp.mockResolvedValue({});
      
      // Mock that apps array will have content after initialization
      mockFirebase.initializeApp.mockImplementation(() => {
        mockFirebase.apps.push({});
        return Promise.resolve({});
      });

      const result = await FirebaseService.initialize();
      
      expect(result).toBe(true);
      expect(FirebaseService.isInitialized).toBe(true);
      expect(FirebaseService.isReady()).toBe(true);
    });

    it('should not reinitialize if already initialized', async () => {
      const mockFirebase = require('@react-native-firebase/app').default;
      mockFirebase.initializeApp.mockResolvedValue({});
      
      // Mock that apps array will have content after initialization
      mockFirebase.initializeApp.mockImplementation(() => {
        mockFirebase.apps.push({});
        return Promise.resolve({});
      });

      // First initialization
      await FirebaseService.initialize();
      
      // Second initialization should return immediately
      const result = await FirebaseService.initialize();
      
      expect(result).toBe(true);
      expect(mockFirebase.initializeApp).toHaveBeenCalledTimes(1);
    });

    it('should handle initialization errors', async () => {
      const mockFirebase = require('@react-native-firebase/app').default;
      const error = new Error('Initialization failed');
      mockFirebase.initializeApp.mockRejectedValue(error);

      await expect(FirebaseService.initialize()).rejects.toThrow('Initialization failed');
      
      expect(FirebaseService.isInitialized).toBe(false);
      expect(FirebaseService.getInitializationError()).toBe(error);
    });
  });

  describe('state management', () => {
    it('should reset state correctly', () => {
      // Set initial state
      (FirebaseService as any).isInitialized = true;
      (FirebaseService as any).initializationPromise = Promise.resolve();
      (FirebaseService as any).initializationError = new Error('Test error');

      FirebaseService.reset();

      expect(FirebaseService.isInitialized).toBe(false);
      expect((FirebaseService as any).initializationPromise).toBeNull();
      expect((FirebaseService as any).initializationError).toBeNull();
    });

    it('should check readiness correctly', () => {
      expect(FirebaseService.isReady()).toBe(false);

      (FirebaseService as any).isInitialized = true;
      const mockFirebase = require('@react-native-firebase/app').default;
      mockFirebase.apps.push({});
      
      expect(FirebaseService.isReady()).toBe(true);
    });
  });
});

describe('Firebase Configuration', () => {
  describe('getFirebaseConfig', () => {
    it('should return iOS config for iOS platform', () => {
      (Platform as any).OS = 'ios';
      const config = getFirebaseConfig();
      
      expect(config).toHaveProperty('apiKey');
      expect(config).toHaveProperty('projectId');
      expect(config).toHaveProperty('appId');
    });

    it('should throw error for unsupported platform', () => {
      (Platform as any).OS = 'web';
      
      expect(() => getFirebaseConfig()).toThrow('Unsupported platform: web');
    });
  });

  describe('validateFirebaseConfig', () => {
    it('should validate correct configuration', () => {
      const validConfig = {
        apiKey: 'test-key',
        projectId: 'test-project',
        storageBucket: 'test-bucket',
        messagingSenderId: '123456789',
        appId: '1:123456789:ios:test',
      };

      expect(validateFirebaseConfig(validConfig)).toBe(true);
    });

    it('should reject invalid configuration', () => {
      const invalidConfig = {
        apiKey: '',
        projectId: 'test-project',
        storageBucket: 'test-bucket',
        messagingSenderId: '123456789',
        appId: '1:123456789:ios:test',
      };

      expect(validateFirebaseConfig(invalidConfig)).toBe(false);
    });

    it('should reject null configuration', () => {
      expect(validateFirebaseConfig(null as any)).toBe(false);
    });

    it('should reject undefined configuration', () => {
      expect(validateFirebaseConfig(undefined as any)).toBe(false);
    });
  });
});
