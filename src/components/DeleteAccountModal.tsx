import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {Theme} from '../@types/theme';
import {FONTS_FAMILIES, SIZES} from '../constants/theme';
import {useTranslation} from 'react-i18next';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason?: string) => void;
  loading?: boolean;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose,
  onConfirm,
  loading = false,
}) => {
  const theme = useTheme() as Theme;
  const {t} = useTranslation();
  const [reason, setReason] = React.useState('');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.modalContainer,
            {backgroundColor: theme.colors.background},
          ]}>
          <View style={styles.header}>
            <Text
              style={[
                styles.title,
                {color: theme.colors.errorText},
              ]}>
              {t('deleteAccountConfirmationTitle')}
            </Text>
          </View>
          
          <View style={styles.content}>
            <Text
              style={[
                styles.message,
                {color: theme.colors.text},
              ]}>
              {t('deleteAccountConfirmationMessage')}
            </Text>
            <TextInput
              style={[
                styles.input,
                {borderColor: theme.colors.border, color: theme.colors.text},
              ]}
              placeholder={t('deleteAccountReasonPlaceholder')}
              placeholderTextColor={theme.colors.placeHolder}
              value={reason}
              onChangeText={setReason}
              editable={!loading}
              maxLength={500}
              multiline
            />
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[
                styles.button,
                styles.cancelButton,
                {borderColor: theme.colors.border},
              ]}
              onPress={onClose}
              disabled={loading}>
              <Text
                style={[
                  styles.buttonText,
                  {color: theme.colors.text},
                ]}>
                {t('cancelLabel')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.button,
                styles.deleteButton,
                {backgroundColor: theme.colors.errorText},
              ]}
              onPress={() => onConfirm(reason.trim() || undefined)}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <Text
                  style={[
                    styles.buttonText,
                    {color: 'white'},
                  ]}>
                  {t('deleteLabel')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    borderRadius: 16,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: SIZES.h4,
    fontFamily: FONTS_FAMILIES.semiBold,
  },
  content: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    minHeight: 80,
    marginTop: 12,
    textAlignVertical: 'top',
  },
  message: {
    fontSize: SIZES.font,
    fontFamily: FONTS_FAMILIES.medium,
    textAlign: 'center',
    lineHeight: 22,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
  },
  cancelButton: {
    borderWidth: 1,
  },
  deleteButton: {
    // backgroundColor is set dynamically
  },
  buttonText: {
    fontSize: SIZES.font,
    fontFamily: FONTS_FAMILIES.medium,
  },
});

export default DeleteAccountModal;
