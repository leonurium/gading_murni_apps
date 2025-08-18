import {Platform} from 'react-native';
import firebase from '@react-native-firebase/app';
import Notification from './notification';
import FirebaseMessaging from './messaging';
import {getFirebaseConfig, validateFirebaseConfig} from './config';

class FirebaseService {
  static isInitialized = false;
  static initializationPromise = null;
  static initializationError = null;

  /**
   * Initialize Firebase with platform-specific configuration
   */
  static async initialize() {
    if (this.isInitialized) {
      return true;
    }

    if (this.initializationPromise) {
      return this.initializationPromise;
    }

    this.initializationPromise = this._performInitialization();
    return this.initializationPromise;
  }

  /**
   * Perform the actual Firebase initialization
   */
  static async _performInitialization() {
    try {
      // Check if Firebase is already initialized
      if (firebase.apps.length > 0) {
        console.log('Firebase already initialized');
        this.isInitialized = true;
        this.initializationError = null;
        return true;
      }

      // Get platform-specific configuration
      const config = getFirebaseConfig();
      
      // Validate configuration
      if (!validateFirebaseConfig(config)) {
        throw new Error(`Invalid Firebase configuration for platform: ${Platform.OS}`);
      }

      // Initialize Firebase
      await firebase.initializeApp(config);
      
      console.log(`Firebase initialized successfully for ${Platform.OS}`);
      this.isInitialized = true;
      this.initializationError = null;
      
      return true;
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      this.isInitialized = false;
      this.initializationError = error;
      this.initializationPromise = null;
      throw error;
    }
  }

  /**
   * Get Firebase app instance
   */
  static getApp() {
    if (!this.isInitialized) {
      throw new Error('Firebase not initialized. Call FirebaseService.initialize() first.');
    }
    return firebase.app();
  }

  /**
   * Check if Firebase is ready to use
   */
  static isReady() {
    return this.isInitialized && firebase.apps.length > 0;
  }

  /**
   * Get initialization error if any
   */
  static getInitializationError() {
    return this.initializationError;
  }

  /**
   * Reset Firebase state (useful for testing)
   */
  static reset() {
    this.isInitialized = false;
    this.initializationPromise = null;
    this.initializationError = null;
  }

  /**
   * Force re-initialization (useful for recovery)
   */
  static async forceReinitialize() {
    this.reset();
    return this.initialize();
  }
}

// Export the service and related modules
export default FirebaseService;
export {Notification, FirebaseMessaging};
