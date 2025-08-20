/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Image,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {FONTS_FAMILIES, IMAGES, SIZES} from '../../../constants/theme';
import {FormInput, Button} from '../../../components';
import {Formik} from 'formik';
import i18n from '../../../i18n/i18n.config';
import {ObjectSchema} from 'yup';
import {registerValidationSchema} from '../constants/ValidationSchema';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {Theme} from '../../../@types/theme';
import {useNavigation} from '@react-navigation/native';
import {RegisterNavigationProp} from '../../../@types/navigation';
import {ScrollView} from 'react-native-gesture-handler';
import {useRegister} from '../../../api/hooks/useAuth';
import {errorFormValidation} from '../../../utils/Validations';
import {RegisterResponse} from '../../../@types/auth';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../store/store';
import {setToken} from '../../../store/userSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type FormValues = {
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber?: string | null;
  password: string;
  confirmPassword: string;
};

const {width} = Dimensions.get('window');

const Register: React.FC = () => {
  const {t} = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useTheme() as Theme;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation<RegisterNavigationProp>();
  const {mutate, status} = useRegister();
  const isLoading = status === 'pending';
  const initialValues: FormValues = {
    fullName: '',
    companyName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  };
  const [formRegisterValidationSchema, setFormRegisterValidationSchema] =
    useState<ObjectSchema<FormValues>>(registerValidationSchema());

  useEffect(() => {
    const handleLanguageChange = () =>
      setFormRegisterValidationSchema(registerValidationSchema);

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  const onFieldSubmit = async (values: FormValues): Promise<void> => {
    mutate(
      {
        full_name: values.fullName,
        company_name: values.companyName as string,
        mobile_number: values.phoneNumber || '',
        password: values.password,
        email: values.email,
      },
      {
        onSuccess: data => {
          const registerData = data as unknown as RegisterResponse;
          dispatch(setToken(registerData.data_body.token));
          navigation.navigate('VerificationMethod', {
            toResetPassword: true,
            data: registerData.data_body,
          });
        },
      },
    );
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.container, {paddingTop: insets.top}]}>
      <Image
        source={IMAGES.logoGmAlt}
        resizeMode="contain"
        style={{
          width: width / 1.4,
          height: width / 2.2,
        }}
      />
      <Text style={[styles.info, {color: theme.colors.text}]}>
        {t('infoRegisterLabel')}
      </Text>
      <View style={styles.centerCard}>
        <Formik
          initialValues={initialValues}
          validationSchema={formRegisterValidationSchema}
          onSubmit={onFieldSubmit}>
          {({handleSubmit, values}) => (
            <View>
              <FormInput
                name="fullName"
                editable={!isLoading}
                label={`*${t('registerFieldFields.fullName')}`}
                placeholder={t('registerFieldFields.fullNamePlaceHolder')}
              />
              <FormInput
                name="companyName"
                editable={!isLoading}
                label={t('registerFieldFields.companyName')}
                placeholder={t('registerFieldFields.companyNamePlaceHolder')}
              />
              <FormInput
                name="email"
                editable={!isLoading}
                label={`*${t('registerFieldFields.email')}`}
                placeholder={t('registerFieldFields.emailPlaceHolder')}
              />
              <FormInput
                name="phoneNumber"
                keyboardType="phone-pad"
                editable={!isLoading}
                label={t('registerFieldFields.phoneNumber')}
                placeholder={t('registerFieldFields.phoneNumberPlaceHolder')}
              />
              <FormInput
                name="password"
                editable={!isLoading}
                label={`*${t('registerFieldFields.password')}`}
                placeholder={t('registerFieldFields.passwordPlaceHolder')}
                secureTextEntry={true}
              />
              <FormInput
                name="confirmPassword"
                editable={!isLoading}
                label={`*${t('registerFieldFields.confirmPassword')}`}
                placeholder={t(
                  'registerFieldFields.confirmPasswordPlaceHolder',
                )}
                secureTextEntry={true}
              />
              <Button
                title={t('btnRegisterLabel')}
                disabled={isLoading}
                loading={isLoading}
                onPress={() => {
                  handleSubmit();
                  errorFormValidation(values, formRegisterValidationSchema);
                }}
                style={{marginTop: 10}}
              />
            </View>
          )}
        </Formik>
      </View>
      <View style={styles.footerCard}>
        <Text style={[styles.loginBtnText, {color: theme.colors.text}]}>
          {t('orLabel')}
        </Text>
        <TouchableOpacity
          activeOpacity={0.8}
          disabled={isLoading}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'Login'}],
            })
          }>
          <Text style={[styles.loginBtnText, {color: theme.colors.primary}]}>
            {t('footerBtnLoginLabel')}
          </Text>
        </TouchableOpacity>
        <Text style={[styles.loginBtnText, {color: theme.colors.text}]}>
          {t('footerLoginLabel')}
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  info: {
    fontFamily: FONTS_FAMILIES.regular,
    fontSize: SIZES.font,
    textAlign: 'center',
  },
  centerCard: {
    width: '100%',
    marginTop: 20,
  },
  loginBtnText: {
    fontFamily: FONTS_FAMILIES.medium,
    fontSize: SIZES.fontLg,
  },
  footerCard: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default Register;
