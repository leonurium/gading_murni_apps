import {Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import firebase from '@react-native-firebase/app';

/**
 * Firebase Messaging Service
 * Handles FCM token operations and messaging functionality
 */
export default class FirebaseMessaging {
  /**
   * Check if Firebase is ready
   * @returns {boolean} True if Firebase is ready
   */
  static isFirebaseReady() {
    return firebase.apps.length > 0;
  }

  /**
   * Get FCM token safely
   * @returns {Promise<string | null>} FCM token or null if failed
   */
  static async getToken() {
    try {
      // Check if Firebase is ready
      if (!this.isFirebaseReady()) {
        console.warn('Firebase not ready, attempting to get token anyway...');
      }
      
      const token = await messaging().getToken();
      console.log('FCM Token retrieved successfully:', token ? `Token exists ${token}` : 'No token');
      return token;
    } catch (error) {
      console.error('getToken Error:', error);
      
      // Provide more specific error information
      if (error.code === 'messaging/not-registered') {
        console.error('Messaging not registered. Please check Firebase configuration.');
      } else if (error.code === 'messaging/permission-denied') {
        console.error('Notification permission denied by user.');
      } else if (error.code === 'messaging/network-error') {
        console.error('Network error while getting FCM token.');
      }
      
      throw error;
    }
  }

  /**
   * Delete FCM token
   * @returns {Promise<string>} Success message
   */
  static async deleteToken() {
    try {
      // Check if Firebase is ready
      if (!this.isFirebaseReady()) {
        console.warn('Firebase not ready, attempting to delete token anyway...');
      }
      
      await messaging().deleteToken();
      console.log('FCM Token deleted successfully');
      return 'Tokens successfully deleted';
    } catch (error) {
      console.error('deleteToken Error:', error);
      throw error;
    }
  }

  /**
   * Check if notification permissions are granted
   * @returns {Promise<boolean>} Permission status
   */
  static async checkPermissions() {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().hasPermission();
        return authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
               authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      } else {
        // For Android, permissions are handled differently
        return true;
      }
    } catch (error) {
      console.error('Error checking notification permissions:', error);
      return false;
    }
  }

  /**
   * Request notification permissions
   * @returns {Promise<boolean>} Permission status
   */
  static async requestPermissions() {
    try {
      if (Platform.OS === 'ios') {
        const authStatus = await messaging().requestPermission();
        return authStatus === messaging.AuthorizationStatus.AUTHORIZED || 
               authStatus === messaging.AuthorizationStatus.PROVISIONAL;
      } else {
        // For Android, permissions are handled differently
        return true;
      }
    } catch (error) {
      console.error('Error requesting notification permissions:', error);
      return false;
    }
  }

  /**
   * Set up message handlers
   * @param {Function} onMessage - Handler for foreground messages
   * @param {Function} onBackgroundMessage - Handler for background messages
   */
  static setupMessageHandlers(onMessage, onBackgroundMessage) {
    try {
      // Foreground message handler
      if (onMessage) {
        messaging().onMessage(onMessage);
      }

      // Background message handler
      if (onBackgroundMessage) {
        messaging().setBackgroundMessageHandler(onBackgroundMessage);
      }
    } catch (error) {
      console.error('Error setting up message handlers:', error);
    }
  }
}
