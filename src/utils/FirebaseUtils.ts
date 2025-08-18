import {Platform} from 'react-native';
import FirebaseService from '../firebase';
import {FirebaseMessaging} from '../firebase';

/**
 * Firebase Utilities
 * Provides a clean API for Firebase operations
 */
export class FirebaseUtils {
  /**
   * Initialize Firebase and get FCM token
   * @returns Promise<string | null> FCM token or null if failed
   */
  static async initializeAndGetToken(): Promise<string | null> {
    try {
      // Ensure Firebase is initialized
      if (!FirebaseService.isReady()) {
        await FirebaseService.initialize();
      }

      // Get FCM token
      const token = await FirebaseMessaging.getToken();
      return token;
    } catch (error) {
      console.error('Failed to initialize Firebase and get token:', error);
      return null;
    }
  }

  /**
   * Get FCM token safely
   * @returns Promise<string | null> FCM token or null if failed
   */
  static async getToken(): Promise<string | null> {
    try {
      if (!FirebaseService.isReady()) {
        console.warn('Firebase not ready, attempting to initialize...');
        await FirebaseService.initialize();
      }

      const token = await FirebaseMessaging.getToken();
      return token;
    } catch (error) {
      console.error('Failed to get FCM token:', error);
      return null;
    }
  }

  /**
   * Delete FCM token
   * @returns Promise<boolean> Success status
   */
  static async deleteToken(): Promise<boolean> {
    try {
      if (!FirebaseService.isReady()) {
        await FirebaseService.initialize();
      }

      await FirebaseMessaging.deleteToken();
      return true;
    } catch (error) {
      console.error('Failed to delete FCM token:', error);
      return false;
    }
  }

  /**
   * Check if Firebase is properly configured for the current platform
   * @returns boolean True if properly configured
   */
  static isPlatformSupported(): boolean {
    return Platform.OS === 'ios' || Platform.OS === 'android';
  }

  /**
   * Get Firebase initialization status
   * @returns Object with initialization status
   */
  static getStatus() {
    return {
      isInitialized: FirebaseService.isInitialized,
      isReady: FirebaseService.isReady(),
      error: FirebaseService.getInitializationError(),
      platform: Platform.OS,
    };
  }

  /**
   * Force re-initialization of Firebase
   * @returns Promise<boolean> Success status
   */
  static async forceReinitialize(): Promise<boolean> {
    try {
      await FirebaseService.forceReinitialize();
      return true;
    } catch (error) {
      console.error('Failed to force re-initialize Firebase:', error);
      return false;
    }
  }

  /**
   * Check notification permissions
   * @returns Promise<boolean> Permission status
   */
  static async checkNotificationPermissions(): Promise<boolean> {
    try {
      return await FirebaseMessaging.checkPermissions();
    } catch (error) {
      console.error('Failed to check notification permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   * @returns Promise<boolean> Permission status
   */
  static async requestNotificationPermissions(): Promise<boolean> {
    try {
      return await FirebaseMessaging.requestPermissions();
    } catch (error) {
      console.error('Failed to request notification permissions:', error);
      return false;
    }
  }
}

export default FirebaseUtils;
