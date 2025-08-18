import FirebaseService from '../index';
import {Notification, FirebaseMessaging} from '../index';

describe('Circular Dependency Tests', () => {
  it('should import FirebaseService without circular dependency', () => {
    expect(FirebaseService).toBeDefined();
    expect(typeof FirebaseService.initialize).toBe('function');
    expect(typeof FirebaseService.isReady).toBe('function');
  });

  it('should import Notification service without circular dependency', () => {
    expect(Notification).toBeDefined();
    expect(typeof Notification.start).toBe('function');
    expect(typeof Notification.getToken).toBe('function');
  });

  it('should import FirebaseMessaging service without circular dependency', () => {
    expect(FirebaseMessaging).toBeDefined();
    expect(typeof FirebaseMessaging.getToken).toBe('function');
    expect(typeof FirebaseMessaging.deleteToken).toBe('function');
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
});
