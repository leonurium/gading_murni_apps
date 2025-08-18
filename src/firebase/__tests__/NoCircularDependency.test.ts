import FirebaseService from '../index';
import {Notification, FirebaseMessaging} from '../index';

describe('No Circular Dependency Tests', () => {
  it('should import all Firebase services without circular dependencies', () => {
    // Test that all services can be imported
    expect(FirebaseService).toBeDefined();
    expect(Notification).toBeDefined();
    expect(FirebaseMessaging).toBeDefined();
  });

  it('should have FirebaseService as the main service', () => {
    expect(typeof FirebaseService.initialize).toBe('function');
    expect(typeof FirebaseService.isReady).toBe('function');
    expect(typeof FirebaseService.getApp).toBe('function');
  });

  it('should have Notification service for push notifications', () => {
    expect(typeof Notification.start).toBe('function');
    expect(typeof Notification.getToken).toBe('function');
    expect(typeof Notification.deleteToken).toBe('function');
  });

  it('should have FirebaseMessaging service for FCM operations', () => {
    expect(typeof FirebaseMessaging.getToken).toBe('function');
    expect(typeof FirebaseMessaging.deleteToken).toBe('function');
    expect(typeof FirebaseMessaging.checkPermissions).toBe('function');
    expect(typeof FirebaseMessaging.setupMessageHandlers).toBe('function');
  });

  it('should be able to call Notification.getToken without errors', async () => {
    // Mock the FirebaseMessaging.getToken method
    const originalGetToken = FirebaseMessaging.getToken;
    FirebaseMessaging.getToken = jest.fn().mockResolvedValue('test-token');

    try {
      const token = await Notification.getToken();
      expect(token).toBe('test-token');
    } finally {
      // Restore original method
      FirebaseMessaging.getToken = originalGetToken;
    }
  });

  it('should be able to call Notification.deleteToken without errors', async () => {
    // Mock the FirebaseMessaging.deleteToken method
    const originalDeleteToken = FirebaseMessaging.deleteToken;
    FirebaseMessaging.deleteToken = jest.fn().mockResolvedValue('Tokens successfully deleted');

    try {
      const result = await Notification.deleteToken();
      expect(result).toBe('Tokens successfully deleted');
    } finally {
      // Restore original method
      FirebaseMessaging.deleteToken = originalDeleteToken;
    }
  });

  it('should have independent service initialization', () => {
    // Each service should be independent
    expect(FirebaseService.isInitialized).toBe(false);
    
    // Notification service should not depend on FirebaseService state
    expect(typeof Notification.start).toBe('function');
    expect(typeof Notification.getToken).toBe('function');
  });
});
