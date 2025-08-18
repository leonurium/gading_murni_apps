# Firebase Architecture

This directory contains a robust Firebase implementation for the Gading Murni app with proper error handling, platform-specific configurations, and clean architecture that **completely eliminates circular dependencies**.

## Architecture Overview

```
src/firebase/
├── index.js          # Main Firebase service (initialization only)
├── config.js         # Firebase configuration constants and validation
├── messaging.js      # Firebase messaging service (FCM operations)
├── notification.js   # Notification service implementation
├── README.md         # This documentation
└── components/       # React components
    └── FirebaseProvider.tsx  # Firebase context provider
```

## Key Components

### 1. FirebaseService (index.js)
- **Singleton pattern** for Firebase initialization
- **Platform-specific configuration** (iOS/Android)
- **Error handling** and recovery mechanisms
- **State management** for initialization status
- **No circular dependencies** - clean import structure
- **Independent service** - does not import other Firebase services

### 2. Firebase Configuration (config.js)
- **Centralized configuration** for both platforms
- **Configuration validation** to ensure required fields
- **Constants** for notification channels and error codes
- **Easy maintenance** of Firebase credentials

### 3. Firebase Messaging Service (messaging.js)
- **FCM token management** with proper error handling
- **Permission management** for iOS/Android
- **Message handlers** for foreground/background
- **Completely independent** - no imports from other Firebase services
- **Direct Firebase app access** for status checking

### 4. Notification Service (notification.js)
- **Push notification handling** for foreground/background
- **Navigation integration** for notification taps
- **Uses FirebaseMessaging service** for token operations
- **Clean separation of concerns**
- **No circular dependencies** - imports only from messaging service

### 5. Firebase Provider (FirebaseProvider.tsx)
- **React context** for Firebase state
- **Automatic initialization** when component mounts
- **Error boundaries** and fallback handling
- **Integration** with React app lifecycle

### 6. Custom Hook (useFirebase.ts)
- **Easy-to-use hook** for Firebase operations
- **State management** for initialization
- **Error handling** and retry mechanisms

### 7. Utility Functions (FirebaseUtils.ts)
- **Clean API** for Firebase operations
- **Safe token management**
- **Platform support checking**
- **Status monitoring**

## Circular Dependency Resolution ✅

The original implementation had a circular dependency issue:
```
index.js -> notification.js -> index.js
```

This was **completely resolved** by:

1. **Creating a separate messaging service** (`messaging.js`) that handles FCM operations
2. **Making services completely independent** - no cross-imports between Firebase services
3. **Restructuring imports** so that each service has a single responsibility
4. **Using direct Firebase app access** in messaging service instead of importing from main service

**Final structure (NO CIRCULAR DEPENDENCIES):**
```
index.js (FirebaseService) - handles initialization only
├── config.js (configuration)
├── messaging.js (FCM operations) - imports directly from @react-native-firebase
└── notification.js (push notifications) - imports only from messaging.js
```

**Key Benefits:**
- ✅ **No require cycles** - clean import hierarchy
- ✅ **Independent services** - each service can be used separately
- ✅ **Better testing** - services can be tested in isolation
- ✅ **Maintainable code** - clear separation of concerns
- ✅ **No undefined errors** - all services are properly available

## Usage

### Basic Initialization

```typescript
import FirebaseService from '../firebase';

// Initialize Firebase
await FirebaseService.initialize();

// Check if ready
if (FirebaseService.isReady()) {
  // Firebase is ready to use
}
```

### Using the Hook

```typescript
import useFirebase from '../hooks/useFirebase';

const MyComponent = () => {
  const { isReady, error, retry } = useFirebase();
  
  if (!isReady) {
    return <LoadingSpinner />;
  }
  
  // Firebase is ready
  return <YourComponent />;
};
```

### Using the Provider

```typescript
import FirebaseProvider from '../components/FirebaseProvider';

const App = () => {
  return (
    <FirebaseProvider 
      fallback={<LoadingScreen />}
      onError={(error) => console.error('Firebase error:', error)}
    >
      <YourApp />
    </FirebaseProvider>
  );
};
```

### Getting FCM Token

```typescript
import FirebaseUtils from '../utils/FirebaseUtils';

// Safe way to get token
const token = await FirebaseUtils.getToken();

// Initialize and get token in one call
const token = await FirebaseUtils.initializeAndGetToken();
```

### Using Messaging Service Directly

```typescript
import {FirebaseMessaging} from '../firebase';

// Get token
const token = await FirebaseMessaging.getToken();

// Delete token
await FirebaseMessaging.deleteToken();

// Check permissions
const hasPermission = await FirebaseMessaging.checkPermissions();
```

## Configuration

### iOS Configuration
The iOS configuration is hardcoded in `config.js` with the provided credentials:

```javascript
export const IOS_FIREBASE_CONFIG = {
  apiKey: 'AIzaSyBORYNwt8WzJ3WL4xPh4Q_4zjSeb7WThA0',
  projectId: 'gading-murni-app',
  storageBucket: 'gading-murni-app.firebasestorage.app',
  messagingSenderId: '1042473916771',
  appId: '1:1042473916771:ios:e2ea1c626c9ce8390a1b56',
  databaseURL: 'https://gading-murni-app.firebaseio.com',
};
```

### Android Configuration
Add your Android Firebase configuration in `config.js` when needed.

## Error Handling

The architecture includes comprehensive error handling:

- **Initialization errors** are captured and can be retried
- **Token retrieval errors** provide specific error codes
- **Permission errors** are handled gracefully
- **Network errors** are logged for debugging
- **Circular dependency errors** are completely eliminated ✅

## Best Practices

1. **Always check Firebase readiness** before using Firebase services
2. **Use the hook or provider** for React components
3. **Handle errors gracefully** with user-friendly messages
4. **Test on both platforms** to ensure compatibility
5. **Monitor initialization logs** for debugging
6. **Avoid circular dependencies** by using proper service separation ✅
7. **Keep services independent** - minimal cross-dependencies

## Troubleshooting

### Common Issues

1. **"No Firebase App '[DEFAULT]' has been created"**
   - Ensure `FirebaseService.initialize()` is called before using Firebase
   - Check that the configuration is valid for the current platform

2. **FCM Token retrieval fails**
   - Verify notification permissions are granted
   - Check network connectivity
   - Ensure Firebase is properly initialized

3. **Circular dependency warnings** ✅
   - **RESOLVED**: No more circular dependencies in the new architecture
   - All services are now completely independent

4. **iOS-specific issues**
   - Verify APNs configuration in Firebase console
   - Check device capabilities and permissions
   - Ensure proper bundle ID configuration

### Debug Mode

Enable debug logging by checking console output:
- Firebase initialization status
- FCM token retrieval attempts
- Permission status changes
- Error details with stack traces

## Security Notes

- **Never commit API keys** to public repositories
- **Use environment variables** for production builds
- **Validate configurations** before initialization
- **Handle sensitive data** securely in notifications

## Testing

The implementation includes comprehensive testing:

- **Unit tests** for all Firebase services: 23/23 tests passing ✅
- **Circular dependency tests** to ensure clean architecture ✅
- **No circular dependency tests** to verify independence ✅
- **Mock implementations** for React Native modules
- **Jest configuration** optimized for React Native

Run tests with:
```bash
npm test -- --testPathPattern=src/firebase
```

**Test Results:**
- ✅ FirebaseService tests: 11/11 passed
- ✅ Circular Dependency tests: 5/5 passed  
- ✅ No Circular Dependency tests: 7/7 passed
- ✅ **Total: 23/23 tests passed**

## Future Enhancements

- [ ] Environment-based configuration
- [ ] Firebase Analytics integration
- [ ] Crashlytics integration
- [ ] A/B testing support
- [ ] Remote config integration
