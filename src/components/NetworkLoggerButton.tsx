import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
  View,
  Text,
} from 'react-native';
import {SvgXml} from 'react-native-svg';
import NetworkLogger from 'react-native-network-logger';

// Icon for network logger (wifi/network icon)
const networkIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 20C13.1 20 14 19.1 14 18C14 16.9 13.1 16 12 16C10.9 16 10 16.9 10 18C10 19.1 10.9 20 12 20Z" fill="${color}"/>
  <path d="M12 14C14.21 14 16 12.21 16 10C16 7.79 14.21 6 12 6C9.79 6 8 7.79 8 10C8 12.21 9.79 14 12 14Z" fill="${color}"/>
  <path d="M12 10C15.31 10 18 7.31 18 4C18 3.45 17.55 3 17 3C16.45 3 16 3.45 16 4C16 6.21 14.21 8 12 8C9.79 8 8 6.21 8 4C8 3.45 7.55 3 7 3C6.45 3 6 3.45 6 4C6 7.31 8.69 10 12 10Z" fill="${color}"/>
</svg>
`;

// Close icon (X)
const closeIcon = (color: string) => `
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="${color}"/>
</svg>
`;

const NetworkLoggerButton: React.FC = () => {
  const [visible, setVisible] = useState(false);

  // Only show in DEV mode
  if (!__DEV__) {
    return null;
  }

  return (
    <>
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}>
        <SvgXml xml={networkIcon('#FFFFFF')} width={24} height={24} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={() => setVisible(false)}>
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Network Logger</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setVisible(false)}
              activeOpacity={0.8}>
              <SvgXml xml={closeIcon('#000000')} width={24} height={24} />
            </TouchableOpacity>
          </View>
          <NetworkLogger />
        </SafeAreaView>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    zIndex: 9999,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
  },
});

export default NetworkLoggerButton;

