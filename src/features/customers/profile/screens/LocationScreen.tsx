/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState, useCallback} from 'react';
import {useRoute, useTheme, useFocusEffect} from '@react-navigation/native';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import {Formik} from 'formik';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import i18n from '../../../../i18n/i18n.config';
import {useTranslation} from 'react-i18next';
import {ObjectSchema} from 'yup';
import {errorFormValidation} from '../../../../utils/Validations';
import {LocationScreenProps} from '../../../../@types/navigation';
import {Theme} from '../../../../@types/theme';
import useLocation from '../../../../hooks/useLocation';
import {LocationForm} from '../../../../@types/location';
import {
  locationInitialForm,
  locationValidationSchema,
} from '../constans/ValidationSchema';
import {ICONS, SIZES} from '../../../../constants/theme';
import {DefaultStyleSheet} from '../../../../constants/DefaultStyleSheet';
import {SvgXml} from 'react-native-svg';
import {
  Button,
  FormBranchesSelector,
  FormDistrictsSelector,
  FormInput,
  FormProvincesSelector,
  FormRegenciesSelector,
  FormVillagesSelector,
} from '../../../../components';
import Toast from 'react-native-simple-toast';
import {LocationPayload} from '../../../../@types/customer';
import {
  useGetLocation,
  useUpdateLocation,
} from '../../../../api/hooks/useCustomer';
import {navigationRef} from '../../../../navigations/navigationService';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {setVerifiedUser} from '../../../../store/userSlice';

const Location: React.FC = () => {
  const {t} = useTranslation();
  const theme = useTheme() as Theme;
  const defautlStyle = DefaultStyleSheet(theme);
  const styles = createStyles(theme);
  const dispatch = useDispatch<AppDispatch>();

  const [location, mapLoading, triggerLocationFetch] = useLocation();
  const route = useRoute<LocationScreenProps['route']>();
  const {data} = useGetLocation();
  const {mutate, status} = useUpdateLocation();
  const isLoading = status === 'pending';

  const [initialValues, setInitialValues] =
    useState<LocationForm>(locationInitialForm);

  const [formValidationSchema, setFormValidationSchema] = useState<
    ObjectSchema<LocationForm>
  >(locationValidationSchema());

  useEffect(() => {
    const handleLanguageChange = () =>
      setFormValidationSchema(locationValidationSchema);

    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, []);

  useEffect(() => {
    if (location && location.latitude && location.longitude) {
      setInitialValues({
        ...initialValues,
        longlat: location,
      });
    }
  }, [location]);

  useFocusEffect(
    useCallback(() => {
      setInitialValues(locationInitialForm);
      if (data) {
        setInitialValues({
          ...initialValues,
          fullAddress: data.fullAddress,
          district: data.district,
          nearestBranch: data.nearestBranch,
          postalCode: data.postalCode,
          province: data.province,
          regency: data.regency,
          village: data.village,
          longlat: data.longlat,
        });
      }
    }, [data]),
  );

  const onFieldSubmit = (values: LocationForm) => {
    const payload: LocationPayload = {
      address_city: values.regency.regency,
      address_city_id: Number(values.regency.code),
      address_detail: values.fullAddress,
      address_district: values.district.district,
      address_district_id: Number(values.district.code),
      address_postal_code: values.postalCode,
      address_province: values.province.province,
      address_province_id: Number(values.province.code),
      address_village: values.village.village,
      address_village_id: Number(values.village.code),
      branch_id: values.nearestBranch.id,
      geo_latitude: String(values.longlat?.latitude),
      geo_longitude: String(values.longlat?.longitude),
    };
    mutate(payload, {
      onSuccess: () => {
        dispatch(setVerifiedUser(true));
        const params = route.params;
        if (params?.resetState) {
          const {resetState} = params;
          navigationRef.reset(resetState);
        } else {
          navigationRef.goBack();
        }
        Toast.show(t('Messages.UpdateDataSuccessfully'), Toast.SHORT);
      },
    });
  };

  return (
    <View style={styles.container}>
      <Formik
        initialValues={initialValues}
        validationSchema={formValidationSchema}
        enableReinitialize={true}
        onSubmit={onFieldSubmit}>
        {({handleSubmit, values, setFieldValue}) => {
          // Ensure coordinates are valid numbers, fallback to initial values
          const latitude = values.longlat?.latitude && !isNaN(Number(values.longlat.latitude))
            ? Number(values.longlat.latitude)
            : locationInitialForm.longlat?.latitude || -6.2088;
          const longitude = values.longlat?.longitude && !isNaN(Number(values.longlat.longitude))
            ? Number(values.longlat.longitude)
            : locationInitialForm.longlat?.longitude || 106.8456;

          return (
          <>
            {!mapLoading ? (
              <MapView
                provider={PROVIDER_GOOGLE}
                style={{flex: 0.4}}
                region={{
                  latitude,
                  longitude,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.005,
                }}>
                <Marker
                  coordinate={{
                    latitude,
                    longitude,
                  }}
                  title={t('myLocationLabel')}
                />
              </MapView>
            ) : (
              <View style={styles.indicatorContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              disabled={isLoading}
              onPress={triggerLocationFetch}
              style={[defautlStyle.shadow, styles.btnGetLocation]}>
              <SvgXml
                xml={ICONS.icnCrossHair(theme.colors.primary)}
                width={25}
                height={25}
              />
            </TouchableOpacity>
            <View style={{flex: 1, marginTop: -20}}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.formContainer}>
                <View style={styles.formRowContainer}>
                  <View style={styles.formItemRowRightContainer}>
                    <FormProvincesSelector
                      name="province"
                      editable={!isLoading}
                      label={`*${t(
                        'CustomerModule.Location.Form.Fields.Province',
                      )}`}
                      onProvinceChange={() => {
                        setFieldValue(
                          'regency',
                          locationInitialForm.regency,
                          false,
                        );
                        setFieldValue(
                          'district',
                          locationInitialForm.district,
                          false,
                        );
                        setFieldValue(
                          'village',
                          locationInitialForm.village,
                          false,
                        );
                        setFieldValue(
                          'postalCode',
                          locationInitialForm.postalCode,
                          false,
                        );
                        setFieldValue(
                          'nearestBranch',
                          locationInitialForm.nearestBranch,
                          false,
                        );
                      }}
                    />
                  </View>
                  <View style={styles.formItemRowLeftContainer}>
                    <FormRegenciesSelector
                      name="regency"
                      provinceCode={values.province.code}
                      editable={Boolean(values.province.code.length)}
                      label={`*${t(
                        'CustomerModule.Location.Form.Fields.Regency',
                      )}`}
                      onRegencyChange={() => {
                        setFieldValue(
                          'district',
                          locationInitialForm.district,
                          false,
                        );
                        setFieldValue(
                          'village',
                          locationInitialForm.village,
                          false,
                        );
                        setFieldValue(
                          'postalCode',
                          locationInitialForm.postalCode,
                          false,
                        );
                        setFieldValue(
                          'nearestBranch',
                          locationInitialForm.nearestBranch,
                          false,
                        );
                      }}
                    />
                  </View>
                </View>
                <View style={styles.formRowContainer}>
                  <View style={styles.formItemRowRightContainer}>
                    <FormDistrictsSelector
                      name="district"
                      label={`*${
                        t('CustomerModule.Location.Form.Fields.District') ||
                        !isLoading
                      }`}
                      regencyCode={values.regency.code}
                      editable={Boolean(values.regency.code.length)}
                      onDistrictChange={() => {
                        setFieldValue(
                          'village',
                          locationInitialForm.village,
                          false,
                        );
                        setFieldValue(
                          'postalCode',
                          locationInitialForm.postalCode,
                          false,
                        );
                      }}
                    />
                  </View>
                  <View style={styles.formItemRowLeftContainer}>
                    <FormVillagesSelector
                      name="village"
                      label={`*${t(
                        'CustomerModule.Location.Form.Fields.Village',
                      )}`}
                      districtCode={values.district.code}
                      editable={Boolean(values.district.code.length)}
                      onVillageChange={item =>
                        setFieldValue('postalCode', item.postalCode, false)
                      }
                    />
                  </View>
                </View>
                <FormInput
                  name="postalCode"
                  label={`*${t(
                    'CustomerModule.Location.Form.Fields.PostalCode',
                  )}`}
                  placeholder={t(
                    'CustomerModule.Location.Form.Fields.PostalCodePlaceHolder',
                  )}
                  editable={false}
                />
                <FormInput
                  name="fullAddress"
                  label={`*${t(
                    'CustomerModule.Location.Form.Fields.FullAddress',
                  )}`}
                  placeholder={t(
                    'CustomerModule.Location.Form.Fields.FullAddressPlaceHolder',
                  )}
                  multiline
                />
                <View style={styles.divider} />
                <FormBranchesSelector
                  name="nearestBranch"
                  label={`*${t(
                    'CustomerModule.Location.Form.Fields.NearestBranch',
                  )}`}
                  editable={Boolean(values.regency.code.length)}
                  cityId={values.regency.code}
                />
                <Button
                  title={t('Actions.Save')}
                  onPress={() => {
                    handleSubmit();
                    errorFormValidation(values, formValidationSchema);
                  }}
                  style={{marginTop: 10}}
                  loading={isLoading}
                  disabled={isLoading}
                />
              </ScrollView>
            </View>
          </>
          );
        }}
      </Formik>
    </View>
  );
};

const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    indicatorContainer: {
      flex: 0.4,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btnGetLocation: {
      width: 40,
      height: 40,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 40 / 2,
      position: 'absolute',
      right: 25,
      top: SIZES.height / 6,
      backgroundColor: theme.colors.background,
    },
    formContainer: {
      flexGrow: 1,
      padding: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      backgroundColor: theme.colors.background,
    },
    formRowContainer: {
      flexDirection: 'row',
    },
    formItemRowLeftContainer: {
      flex: 0.5,
      marginLeft: 10,
    },
    formItemRowRightContainer: {
      flex: 0.5,
      marginRight: 10,
    },
    divider: {
      width: '100%',
      height: 1,
      marginVertical: 10,
      backgroundColor: theme.colors.border,
    },
  });

export default Location;
