import {TFunction} from 'i18next';
import {ICONS} from '../../../../../constants/theme';
import {Theme} from '../../../../../@types/theme';

export type TActions = {
  id: string;
  colors: string[];
  label: string;
  icons: string[];
  navigateTo?: 'EditProfile' | 'ChangePassword' | 'Setting' | 'AboutUs';
  action?: 'logout';
};

export const getActionsData = (theme: Theme, t: TFunction): TActions[] => [
  {
    id: 'change-personal-data',
    colors: [theme.colors.primary, theme.colors.headerText],
    label: t('changePersonalDataLabel'),
    icons: [
      ICONS.icnCircleUser(theme.colors.primary),
      ICONS.icnArrowNarrowRight(theme.colors.headerText),
    ],
    navigateTo: 'EditProfile',
  },
  {
    id: 'change-password',
    colors: [theme.colors.primary, theme.colors.headerText],
    label: t('changePasswordLabel'),
    icons: [
      ICONS.icnKey(theme.colors.primary),
      ICONS.icnArrowNarrowRight(theme.colors.headerText),
    ],
    navigateTo: 'ChangePassword',
  },
  {
    id: 'setting',
    colors: [theme.colors.primary, theme.colors.headerText],
    label: t('settingLabel'),
    icons: [
      ICONS.icnGear(theme.colors.primary),
      ICONS.icnArrowNarrowRight(theme.colors.headerText),
    ],
    navigateTo: 'Setting',
  },
  {
    id: 'about-us',
    colors: [theme.colors.primary, theme.colors.headerText],
    label: t('aboutUsLabel'),
    icons: [
      ICONS.icnLifeRing(theme.colors.primary),
      ICONS.icnArrowNarrowRight(theme.colors.headerText),
    ],
    navigateTo: 'AboutUs',
  },
  {
    id: 'logout',
    colors: [theme.colors.errorText, theme.colors.errorText],
    label: t('logoutLabel'),
    icons: [
      ICONS.icnArrowRightFromBracket(theme.colors.errorText),
      ICONS.icnArrowNarrowRight(theme.colors.errorText),
    ],
    action: 'logout',
  },
];
