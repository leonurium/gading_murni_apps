import * as yup from 'yup';
import i18n from '../../../i18n/i18n.config';
import {ChangePasswordForm} from '../../../@types/auth';

export const loginValidationSchema = () =>
  yup.object().shape({
    email: yup
      .string()
      .email(i18n.t('loginFormValidation.email'))
      .required(
        i18n.t('loginFormValidation.required', {
          field: i18n.t('loginFieldFields.email'),
        }),
      ),
    password: yup.string().required(
      i18n.t('loginFormValidation.required', {
        field: i18n.t('loginFieldFields.password'),
      }),
    ),
  });

export const forgetValidationSchema = (otpType: string) =>
  yup.object().shape({
    account:
      otpType === 'Email'
        ? yup
            .string()
            .email(i18n.t('forgetFormValidation.email'))
            .required(
              i18n.t('forgetFormValidation.required', {
                field: i18n.t('forgetFieldFields.email'),
              }),
            )
        : yup
            .string()
            .matches(
              /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
              i18n.t('forgetFormValidation.phoneNumber'),
            )
            .required(
              i18n.t('forgetFormValidation.required', {
                field: i18n.t('forgetFieldFields.phoneNumber'),
              }),
            ),
  });

export const registerValidationSchema = () =>
  yup.object().shape({
    fullName: yup.string().required(
      i18n.t('registerFormValidation.required', {
        field: i18n.t('registerFieldFields.fullName'),
      }),
    ),
    companyName: yup.string(),
    email: yup
      .string()
      .email(i18n.t('registerFormValidation.email'))
      .required(
        i18n.t('registerFormValidation.required', {
          field: i18n.t('registerFieldFields.email'),
        }),
      ),
    phoneNumber: yup
      .string()
      .nullable()
      .transform(value => (value === '' ? null : value))
      .test(
        'valid-phone-optional',
        i18n.t('registerFormValidation.phoneNumber'),
        value =>
          value == null || /^(\+62|62|0)8[1-9][0-9]{6,9}$/.test(String(value)),
      ),
    password: yup
      .string()
      .min(
        8,
        i18n.t('registerFormValidation.min', {
          field: i18n.t('registerFieldFields.password'),
          min: 8,
        }),
      )
      .required(
        i18n.t('registerFormValidation.required', {
          field: i18n.t('registerFieldFields.password'),
        }),
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password')],
        i18n.t('registerFormValidation.confirmPassword'),
      )
      .required(
        i18n.t('registerFormValidation.required', {
          field: i18n.t('registerFieldFields.confirmPassword'),
        }),
      ),
  });

export const changePasswordInitialForm: ChangePasswordForm = {
  account: '',
  password: '',
  confirmPassword: '',
  otp: '',
};

export const changePasswordValidationSchema = (otpType: string) =>
  yup.object().shape({
    account:
      otpType === 'Email'
        ? yup
            .string()
            .email(i18n.t('AuthModule.ResetPassword.Form.Validation.Email'))
            .required(
              i18n.t('AuthModule.ResetPassword.Form.Validation.Required', {
                field: i18n.t('AuthModule.ResetPassword.Form.Fields.Email'),
              }),
            )
        : yup
            .string()
            .matches(
              /^(\+62|62|0)8[1-9][0-9]{6,9}$/,
              i18n.t('AuthModule.ResetPassword.Form.Validation.Email'),
            )
            .required(
              i18n.t('AuthModule.ResetPassword.Form.Validation.Required', {
                field: i18n.t('AuthModule.ResetPassword.Form.Fields.Email'),
              }),
            ),
    otp: yup.string().required(
      i18n.t('AuthModule.ResetPassword.Form.Validation.Required', {
        field: i18n.t('AuthModule.ResetPassword.Form.Fields.Otp'),
      }),
    ),
    password: yup
      .string()
      .min(
        8,
        i18n.t('AuthModule.ResetPassword.Form.Validation.Min', {
          field: i18n.t('AuthModule.ResetPassword.Form.Fields.Password'),
          min: 8,
        }),
      )
      .required(
        i18n.t('AuthModule.ResetPassword.Form.Validation.Required', {
          field: i18n.t('AuthModule.ResetPassword.Form.Fields.Password'),
        }),
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password')],
        i18n.t('AuthModule.ResetPassword.Form.Validation.ConfirmPassword'),
      )
      .required(
        i18n.t('AuthModule.ResetPassword.Form.Validation.Required', {
          field: i18n.t('AuthModule.ResetPassword.Form.Fields.ConfirmPassword'),
        }),
      ),
  });
