/* eslint-disable react-native/no-inline-styles */
import {useNavigation, useTheme} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import React from 'react';
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import {Theme} from '../../../../@types/theme';
import {
  FONTS_FAMILIES,
  ICONS,
  IMAGES,
  SIZES,
} from '../../../../constants/theme';
import {useTranslation} from 'react-i18next';
import {SvgXml} from 'react-native-svg';
import {TActions, getActionsData} from '../constans/ActionsData';
import {
  ProfileNavigationProp,
  RootNavigatorParamList,
} from '../../../../@types/navigation';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {setVerifiedUser, setToken} from '../../../../store/userSlice';
import {
  useCustomer,
  useCustomerProfile,
} from '../../../../api/hooks/useCustomer';
import {useUploadPhoto} from '../../../../api/hooks/useSupports';
import {
  launchImageLibrary,
  ImageLibraryOptions,
  ImagePickerResponse,
} from 'react-native-image-picker';
import {UploadPhotoResponse} from '../../../../@types/support';
import Toast from 'react-native-simple-toast';
import {config} from '../../../../constants/Configs';
import {DeleteAccountModal} from '../../../../components';
import {useDeleteCustomerAccount} from '../../../../api/hooks/useCustomer';

const Profile: React.FC = () => {
  const theme = useTheme() as Theme;
  const navigation = useNavigation<ProfileNavigationProp>();
  const {t} = useTranslation();
  const initialActions: TActions[] = getActionsData(theme, t);
  const dispatch = useDispatch<AppDispatch>();
  const {data, refetch} = useCustomer();
  const {mutate} = useUploadPhoto();
  const {mutate: mutateCustomerProfile} = useCustomerProfile();
  const {mutate: deleteAccount, isPending: isDeleting} = useDeleteCustomerAccount();
  const [showDeleteModal, setShowDeleteModal] = React.useState(false);

  const onPressHandle = (item: TActions) => {
    if (item.action === 'logout' || item.id === 'logout') {
      dispatch(setVerifiedUser(false));
      dispatch(setToken(null));
      const logoutNavigate =
        navigation as unknown as NativeStackNavigationProp<RootNavigatorParamList>;
      logoutNavigate.reset({
        index: 0,
        routes: [{name: 'Auth', state: {routes: [{name: 'Login'}]}}],
      });
    } else if (item.action === 'deleteAccount') {
      setShowDeleteModal(true);
    } else {
      if (item.navigateTo) {
        navigation.navigate(item.navigateTo);
      }
    }
  };

  const handleDeleteAccount = (reason?: string) => {
    deleteAccount(
      {
        confirmation: 'DELETE_ACCOUNT',
        ...(reason ? {reason} : {}),
      },
      {
      onSuccess: () => {
        setShowDeleteModal(false);
        Toast.show(t('deleteAccountSuccess'), Toast.SHORT);
        dispatch(setVerifiedUser(false));
        dispatch(setToken(null));
        const logoutNavigate =
          navigation as unknown as NativeStackNavigationProp<RootNavigatorParamList>;
        logoutNavigate.reset({
          index: 0,
          routes: [{name: 'Auth', state: {routes: [{name: 'Login'}]}}],
        });
      },
      onError: () => {
        Toast.show(t('deleteAccountError'), Toast.SHORT);
      },
      },
    );
  };

  const handleUpload = () => {
    const options: ImageLibraryOptions = {
      selectionLimit: 1,
      mediaType: 'photo',
    };

    launchImageLibrary(options, (response: ImagePickerResponse) => {
      if (response.didCancel) {
        console.info('User cancelled camera picker');
      } else if (response.errorMessage) {
        console.error('Camera Error: ', response.errorMessage);
      } else {
        const firstAsset = response.assets?.[0];
        if (firstAsset?.uri) {
          mutate(
            {
              uri: firstAsset.uri,
              name: firstAsset.fileName,
              type: firstAsset.type,
            },
            {
              onSuccess: uploadData => {
                const responseUploadData =
                  uploadData as unknown as UploadPhotoResponse;
                mutateCustomerProfile(
                  {
                    full_name: data!.data_body.user.profile?.full_name || '',
                    email: data!.data_body.user.email || '',
                    mobile_number: data!.data_body.user.mobile_number || '',
                    company_name:
                      data!.data_body.user.customer?.company_name || '',
                    image_path: responseUploadData.data_body.image_path,
                  },
                  {
                    onSuccess: () => {
                      refetch();
                      Toast.show(t('toastSuccessUpdate'), Toast.SHORT);
                    },
                  },
                );
              },
            },
          );
        }
      }
    });
  };

  const renderItem = ({item}: {item: TActions}) => (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPressHandle(item)}
      style={[
        styles.itemContainer,
        {
          backgroundColor: theme.colors.background,
          borderColor: item.colors[0],
        },
      ]}>
      <SvgXml xml={item.icons[0]} width={24} height={24} />
      <Text
        style={[
          styles.itemTitle,
          {
            color: item.colors[1],
            fontFamily: FONTS_FAMILIES.medium,
            fontSize: SIZES.font,
          },
        ]}>
        {item.label}
      </Text>
      <SvgXml xml={item.icons[1]} width={24} height={24} />
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        {backgroundColor: theme.colors.profileBackground},
      ]}>
      <View
        style={[
          styles.contentContainer,
          {backgroundColor: theme.colors.background},
        ]}>
        <View
          style={[
            styles.avatarContainer,
            {backgroundColor: theme.colors.border},
          ]}>
          <Image
            source={
              data?.data_body.user.profile?.image_path
                ? {
                    uri: `${config.baseURL}/storage/${data?.data_body.user.profile?.image_path}`,
                  }
                : IMAGES.userAvatar
            }
            resizeMode="cover"
            style={{
              width: 93,
              height: 93,
              borderRadius: 93 / 2,
            }}
          />
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleUpload}
            style={[
              styles.changeAvatar,
              {
                backgroundColor: theme.colors.primary,
              },
            ]}>
            <SvgXml xml={ICONS.icnPhoto} width={15} height={15} />
          </TouchableOpacity>
        </View>
        <View style={styles.informContainer}>
          <Text
            style={{
              color: theme.colors.headerText,
              fontSize: SIZES.h3,
              fontFamily: FONTS_FAMILIES.semiBold,
              marginBottom: 5,
            }}>
            {data?.data_body.user.profile?.full_name}
          </Text>
          <Text
            style={{
              color: theme.colors.placeHolder,
              fontSize: SIZES.font,
              fontFamily: FONTS_FAMILIES.medium,
              marginBottom: 3,
            }}>
            {data?.data_body.user.customer?.company_name}
          </Text>
          <Text
            style={{
              color: theme.colors.primary,
              fontSize: SIZES.font,
              fontFamily: FONTS_FAMILIES.medium,
            }}>
            {data?.data_body?.user?.branches?.[0]?.name}
          </Text>
        </View>
        <FlatList
          data={initialActions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
      <DeleteAccountModal
        visible={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteAccount}
        loading={isDeleting}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentContainer: {
    flex: 0.9,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
  avatarContainer: {
    width: 93,
    height: 93,
    borderRadius: 93 / 2,
    marginTop: -(93 / 2),
    alignSelf: 'center',
  },
  informContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    justifyContent: 'space-between',
  },
  itemTitle: {
    flex: 1,
    paddingHorizontal: 20,
  },
  changeAvatar: {
    padding: 5,
    width: 30,
    height: 30,
    borderRadius: 30 / 2,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Profile;
