import * as yup from 'yup';
import i18n from '../../../../i18n/i18n.config';
import {LocationForm} from '../../../../@types/location';

export const editProfileValidationSchema = () =>
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
      .matches(
        /^(\+62|62|0)8[1-9][0-9]{5,12}$/,
        i18n.t('registerFormValidation.phoneNumber'),
      )
      .required(
        i18n.t('registerFormValidation.required', {
          field: i18n.t('registerFieldFields.phoneNumber'),
        }),
      ),
  });

export const changePasswordValidationSchema = () =>
  yup.object().shape({
    oldPassword: yup.string().required(
      i18n.t('changePasswordFormValidation.required', {
        field: i18n.t('changePasswordFieldFields.oldPassword'),
      }),
    ),
    password: yup
      .string()
      .min(
        8,
        i18n.t('changePasswordFormValidation.min', {
          field: i18n.t('changePasswordFieldFields.password'),
          min: 8,
        }),
      )
      .required(
        i18n.t('changePasswordFormValidation.required', {
          field: i18n.t('changePasswordFieldFields.password'),
        }),
      ),
    confirmPassword: yup
      .string()
      .oneOf(
        [yup.ref('password')],
        i18n.t('changePasswordFormValidation.confirmPassword'),
      )
      .required(
        i18n.t('changePasswordFormValidation.required', {
          field: i18n.t('changePasswordFieldFields.confirmPassword'),
        }),
      ),
  });

// Default coordinates: Jakarta, Indonesia
const DEFAULT_COORDINATES = {
  latitude: -6.2088,
  longitude: 106.8456,
};

export const locationInitialForm: LocationForm = {
  province: {code: '', province: ''},
  regency: {code: '', province: '', regency: '', type: ''},
  district: {code: '', regency: '', district: ''},
  village: {code: '', district: '', village: '', postalCode: ''},
  postalCode: '',
  fullAddress: '',
  nearestBranch: {
    id: '',
    created_at: '',
    description: '',
    is_active: 0,
    name: '',
    updated_at: '',
  },
  longlat: DEFAULT_COORDINATES,
};

export const locationValidationSchema = () =>
  yup.object().shape({
    longlat: yup.object({
      latitude: yup.number(),
      longitude: yup.number(),
    }),
    province: yup.object({
      code: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Province'),
        }),
      ),
      province: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Province'),
        }),
      ),
    }),
    regency: yup.object({
      code: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Regency'),
        }),
      ),
      province: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Regency'),
        }),
      ),
      regency: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Regency'),
        }),
      ),
      type: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Regency'),
        }),
      ),
    }),
    district: yup.object({
      code: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.District'),
        }),
      ),
      regency: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.District'),
        }),
      ),
      district: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.District'),
        }),
      ),
    }),
    village: yup.object({
      code: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Village'),
        }),
      ),
      district: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Village'),
        }),
      ),
      village: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Village'),
        }),
      ),
      postalCode: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.Village'),
        }),
      ),
    }),
    postalCode: yup
      .string()
      .required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.PostalCode'),
        }),
      )
      .matches(/^\d{5}$/, {
        message: i18n.t('CustomerModule.Location.Form.Validation.PostalCode'),
        excludeEmptyString: true,
      }),
    fullAddress: yup.string().required(
      i18n.t('CustomerModule.Location.Form.Validation.Required', {
        field: i18n.t('CustomerModule.Location.Form.Fields.FullAddress'),
      }),
    ),
    nearestBranch: yup.object({
      id: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
      name: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
      description: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
      is_active: yup.number().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
      created_at: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
      updated_at: yup.string().required(
        i18n.t('CustomerModule.Location.Form.Validation.Required', {
          field: i18n.t('CustomerModule.Location.Form.Fields.NearestBranch'),
        }),
      ),
    }),
  });
