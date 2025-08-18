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
import {TActions, getActionsData} from './constans/ActionsData';
import {
  RootNavigatorParamList,
  TechnicianProfileNavigationProp,
} from '../../../../@types/navigation';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../../../store/store';
import {setToken, setRoleId} from '../../../../store/userSlice';
import {useUploadPhoto} from '../../../../api/hooks/useSupports';
import {UploadPhotoResponse} from '../../../../@types/support';
import {
  ImageLibraryOptions,
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {useAdminProfile, useAdminProfileDetail} from '../../../../api/hooks/useAdminServices';
import {config} from '../../../../constants/Configs';
import Toast from 'react-native-simple-toast';

const Profile: React.FC = () => {
  const theme = useTheme() as Theme;
  const navigation = useNavigation<TechnicianProfileNavigationProp>();
  const {t} = useTranslation();
  const initialActions: TActions[] = getActionsData(theme, t);
  const dispatch = useDispatch<AppDispatch>();
  const {mutate} = useUploadPhoto();
  const {data, refetch} = useAdminProfileDetail();
  const {mutate: mutateAdminProfile} = useAdminProfile();

  const onPressHandle = (item: TActions) => {
    if (item.action === 'logout') {
      dispatch(setToken(null));
      dispatch(setRoleId(null));
      const logoutNavigate =
        navigation as unknown as NativeStackNavigationProp<RootNavigatorParamList>;
      logoutNavigate.reset({
        index: 0,
        routes: [{name: 'Auth', state: {routes: [{name: 'Login'}]}}],
      });
    } else {
      if (item?.navigateTo) {
        navigation.navigate(item.navigateTo);
      }
    }
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
                mutateAdminProfile(
                  {
                    full_name: data!.data_body.user.name,
                    email: data!.data_body.user.email,
                    mobile_number: data!.data_body.user.mobile_number,
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
            {data?.data_body.user.name}
          </Text>
          <Text
            style={{
              color: theme.colors.placeHolder,
              fontSize: SIZES.font,
              fontFamily: FONTS_FAMILIES.medium,
              marginBottom: 3,
            }}>
            {data?.data_body.user.roles[0]?.name_alias}
          </Text>
        </View>
        <FlatList
          data={initialActions}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
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
    marginBottom: 20,
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
  informContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});

export default Profile;
