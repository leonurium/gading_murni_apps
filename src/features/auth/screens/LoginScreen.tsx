/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {FONTS_FAMILIES, IMAGES, SIZES} from '../../../constants/theme';
import {FormInput, Button} from '../../../components';
import {Formik} from 'formik';
import i18n from '../../../i18n/i18n.config';
import {ObjectSchema} from 'yup';
import {loginValidationSchema} from '../constants/ValidationSchema';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Theme} from '../../../@types/theme';
import {useNavigation} from '@react-navigation/native';
import {LoginNavigationProp} from '../../../@types/navigation';
import {errorFormValidation} from '../../../utils/Validations';
import useKeyboardStatus from '../../../hooks/useKeyboardStatus';
import {useLogin} from '../../../api/hooks/useAuth';
import {LoginResponse, UserType} from '../../../@types/auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../store/store';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {setUserType, setToken, setRoleId} from '../../../store/userSlice';
import {navigationRef} from '../../../navigations/navigationService';
import {Notification} from '../../../firebase';

type FormValues = {
  email: string;
  password: string;
};

const {width} = Dimensions.get('window');

const Login: React.FC = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const navigation = useNavigation<LoginNavigationProp>();
  const dispatch = useDispatch<AppDispatch>();
  const {mutate, status} = useLogin();
  const keyboardShown = useKeyboardStatus();
  const initialValues: FormValues = {
    email: '',
    password: '',
  };
  const isLoading = status === 'pending';
  const [formLoginValidationSchema, setFormLoginValidationSchema] = useState<
    ObjectSchema<FormValues>
  >(loginValidationSchema());

  useEffect(() => {
    const handleLanguageChange = () =>
      setFormLoginValidationSchema(loginValidationSchema);

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const onFieldSubmit = async (values: FormValues): Promise<void> => {
    try {
      const device_token = await Notification.getToken();
      if (!device_token) {
        console.warn('No device token available. Blocking login.');
        Alert.alert(
          'Notifications required',
          'Failed to get device token. Please enable notifications and try again.',
        );
        return;
      }

      mutate(
        {username: values.email, password: values.password, device_token},
        {
          onSuccess: data => {
            const loginData = data as unknown as LoginResponse;
            dispatch(setToken(loginData.data_body.token));
            dispatch(setUserType(loginData.data_body.user_type));
            if (loginData.data_body.user_type === UserType.CUSTOMER) {
              if (!loginData.data_body.otp_verified) {
                navigationRef.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'Otp',
                      params: {
                        email: loginData.data_body.user.email,
                      },
                    },
                  ],
                });
              } else {
                navigationRef.reset({
                  index: 0,
                  routes: [{name: 'CustomerHome'}],
                });
              }
            } else {
              dispatch(setRoleId(loginData.data_body.user.role!.id));
              navigationRef.reset({
                index: 0,
                routes: [{name: 'TechnicianHome'}],
              });
            }
          },
        },
      );
    } catch (error) {
      console.error('Error getting device token:', error);
      Alert.alert(
        'Notifications required',
        'Failed to get device token. Please enable notifications and try again.',
      );
      return;
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{flexGrow: 1, paddingTop: insets.top}}>
      <View style={styles.container}>
        <Image
          source={IMAGES.logoGmAlt}
          resizeMode="contain"
          style={{
            width: width / 1.4,
            height: width / 2.2,
          }}
        />
        <View style={styles.centerCard}>
          <Formik
            initialValues={initialValues}
            validationSchema={formLoginValidationSchema}
            enableReinitialize={true}
            validateOnChange={false}
            validateOnBlur={false}
            onSubmit={onFieldSubmit}>
            {({handleSubmit, values}) => (
              <View>
                <FormInput
                  name="email"
                  editable={!isLoading}
                  label={t('loginFieldFields.email')}
                  placeholder={t('loginFieldFields.emailPlaceHolder')}
                />
                <FormInput
                  name="password"
                  editable={!isLoading}
                  label={t('loginFieldFields.password')}
                  placeholder={t('loginFieldFields.passwordPlaceHolder')}
                  secureTextEntry={true}
                />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() =>
                    navigation.navigate('VerificationMethod', {
                      toResetPassword: false,
                    })
                  }
                  disabled={isLoading}
                  style={styles.forgotBtn}>
                  <Text
                    style={[
                      styles.forgotBtnText,
                      {color: theme.colors.primary},
                    ]}>
                    {t('btnForgetLabel')}
                  </Text>
                </TouchableOpacity>
                <Button
                  title={t('btnLoginLabel')}
                  disabled={isLoading}
                  loading={isLoading}
                  onPress={() => {
                    handleSubmit();
                    errorFormValidation(values, formLoginValidationSchema);
                  }}
                />
              </View>
            )}
          </Formik>
        </View>
        {!keyboardShown && (
          <View style={styles.footerCard}>
            <Text style={[styles.forgotBtnText, {color: theme.colors.text}]}>
              {t('footerCreateAccountLabel')}
            </Text>
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isLoading}
              onPress={() =>
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Register'}],
                })
              }>
              <Text
                style={[styles.forgotBtnText, {color: theme.colors.primary}]}>
                {t('footerBtnCreateAccountLabel')}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  centerCard: {
    width: '100%',
    paddingHorizontal: 20,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginTop: 5,
    marginBottom: 20,
  },
  forgotBtnText: {
    fontFamily: FONTS_FAMILIES.medium,
    fontSize: SIZES.fontLg,
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
  },
});

export default Login;
