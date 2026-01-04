import React, {useEffect} from 'react';
import Routes from './src/navigations/Routes';
import {ThemeProvider} from './src/constants/ThemeContext';
import {SafeAreaView, NetworkLoggerButton} from './src/components';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import SplashScreen from 'react-native-splash-screen';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/store/store';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Alert, Platform} from 'react-native';
import FirebaseService from './src/firebase';
import {Notification} from './src/firebase';
import FirebaseProvider from './src/components/FirebaseProvider';

const queryClient = new QueryClient({});

const App: React.FC = () => {
  useEffect(() => {
    SplashScreen.hide();

    const checkAndRequestPermissions = async () => {
      try {
        const cameraStatus = await check(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.CAMERA
            : PERMISSIONS.ANDROID.CAMERA,
        );

        if (cameraStatus !== RESULTS.GRANTED) {
          const newCameraStatus = await request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.CAMERA
              : PERMISSIONS.ANDROID.CAMERA,
          );

          if (newCameraStatus !== RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Camera permission is required to use this app.',
            );
          }
        }

        const locationStatus = await check(
          Platform.OS === 'ios'
            ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
            : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        );

        if (locationStatus !== RESULTS.GRANTED) {
          const newLocationStatus = await request(
            Platform.OS === 'ios'
              ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
              : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
          );

          if (newLocationStatus !== RESULTS.GRANTED) {
            Alert.alert(
              'Permission Required',
              'Location permission is required to use this app.',
            );
          }
        }
      } catch (error) {
        console.error('Permission request error:', error);
      }
    };

    const initializeFirebase = async () => {
      try {
        // Initialize Firebase first
        await FirebaseService.initialize();
        
        // Then start notification service (Firebase is now ready)
        await Notification.start();
        
        console.log('Firebase and notification services initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Firebase services:', error);
        // Don't throw here - let the FirebaseProvider handle the error state
      }
    };

    checkAndRequestPermissions();
    initializeFirebase();
  }, []);

  const handleFirebaseError = (error: Error) => {
    console.error('Firebase error in App component:', error);
    // You can add additional error handling here, such as showing a user-friendly error message
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <SafeAreaView>
            <QueryClientProvider client={queryClient}>
              <ThemeProvider>
                <FirebaseProvider onError={handleFirebaseError}>
                  <Routes />
                  <NetworkLoggerButton />
                </FirebaseProvider>
              </ThemeProvider>
            </QueryClientProvider>
          </SafeAreaView>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
};

export default App;
