import {PermissionsAndroid, Platform} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import PushNotification from 'react-native-push-notification';
import {navigationRef} from '../navigations/navigationService';
import {store, persistor} from '../store/store';
import FirebaseMessaging from './messaging';

export default class Notification {
  static async start() {
    try {
      // Note: Firebase should be initialized before calling this method
      // This method assumes Firebase is already ready
      
      if (Platform.OS === 'android') {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
        );
      }
      
      // Must be outside of any component LifeCycle (such as `componentDidMount`).
      PushNotification.configure({
        // (optional) Called when Token is generated (iOS and Android)
        onRegister: async () => {
          PushNotification.createChannel({
            channelId: 'high-priority', // (required)
            channelName: 'High Priority', // (required)
          });
        },

        // (required) Called when a remote is received (except quit state) or opened, or local notification is opened
        onNotification: notification => {
          console.log('NOTIFICATION1:', notification);
          const user = store.getState().user;
          const rootState = navigationRef.getRootState();
          if (notification.userInteraction) {
            // console.log('User Tapped the notification');
            if (user.userType === 'CUSTOMER') {
              navigationRef.navigate('CustomerHome', {
                state: {
                  routes: [
                    {
                      name: 'BookingTab',
                      state: {
                        routes: [
                          {
                            name: 'Booking',
                          },
                          {
                            name: 'BookingDetail',
                            params: {
                              bookingId: notification.data.id,
                              resetState: rootState,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              });
            } else {
              navigationRef.navigate('TechnicianHome', {
                state: {
                  routes: [
                    {
                      name: 'BookingTab',
                      state: {
                        routes: [
                          {
                            name: 'Booking',
                          },
                          {
                            name: 'BookingDetail',
                            params: {
                              bookingId: notification.data.id,
                              bookingCode: notification.data.booking_code,
                              resetState: rootState,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              });
            }
          }
          // (required) Called when a remote is received or opened, or local notification is opened
          notification.finish(PushNotificationIOS.FetchResult.NoData);
        },

        // (optional) Called when Registered Action is pressed and invokeApp is false, if true onNotification will be called (Android)
        onAction: notification => {
          console.log('ACTION:', notification.action);
          console.log('NOTIFICATION2:', notification);
        },

        // (optional) Called when the user fails to register for remote notifications. Typically occurs when APNS is having issues, or the device is a simulator. (iOS)
        onRegistrationError: err => {
          console.error(err.message, err);
        },

        // Should the initial notification be popped automatically
        // default: true
        popInitialNotification: true,

        /**
         * (optional) default: true
         * - Specified if permissions (ios) and token (android and ios) will requested or not,
         * - if not, you must call PushNotificationsHandler.requestPermissions() later
         * - if you are not using remote notification or do not have Firebase installed, use this:
         *     requestPermissions: Platform.OS === 'ios'
         */
        requestPermissions: true,
      });

      // Set up Firebase messaging handlers
      FirebaseMessaging.setupMessageHandlers(
        // Foreground message handler
        async (remoteMessage) => {
          console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
          const {title, body} = remoteMessage.notification;
          PushNotification.localNotification({
            channelId: 'high-priority',
            title,
            message: body,
            userInfo: remoteMessage.data,
          });
        },
        // Background message handler
        async (remoteMessage) => {
          // console.log('Message handled in the background!', remoteMessage);
        }
      );
      
      console.log('Notification service started successfully');
    } catch (error) {
      console.error('Failed to start notification service:', error);
      throw error;
    }
  }

  /**
   * Get FCM token using the messaging service
   * @returns {Promise<string | null>} FCM token
   */
  static async getToken() {
    return FirebaseMessaging.getToken();
  }

  /**
   * Delete FCM token using the messaging service
   * @returns {Promise<string>} Success message
   */
  static async deleteToken() {
    return FirebaseMessaging.deleteToken();
  }

  /**
   * Check if notification permissions are granted
   * @returns {Promise<boolean>} Permission status
   */
  static async checkPermissions() {
    return FirebaseMessaging.checkPermissions();
  }

  /**
   * Request notification permissions
   * @returns {Promise<boolean>} Permission status
   */
  static async requestPermissions() {
    return FirebaseMessaging.requestPermissions();
  }
}
