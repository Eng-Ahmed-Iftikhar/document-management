// next
import { Public_Sans } from 'next/font/google';

// types
import { DefaultConfigProps } from 'types/config';

// ==============================|| THEME CONSTANT ||============================== //

export const twitterColor = '#1DA1F2';
export const facebookColor = '#3b5998';
export const linkedInColor = '#0e76a8';

export const APP_DEFAULT_PATH = '/documents';
export const SIGN_IN_PATH = '/sign-in';

export const HORIZONTAL_MAX_ITEM = 7;
export const DRAWER_WIDTH = 260;
export const MINI_DRAWER_WIDTH = 60;

const publicSans = Public_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '300', '700'],
});

export enum SimpleLayoutType {
  SIMPLE = 'simple',
  LANDING = 'landing',
}

export enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

export enum MenuOrientation {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
}

export enum ThemeDirection {
  LTR = 'ltr',
  RTL = 'rtl',
}

export enum NavActionType {
  FUNCTION = 'function',
  LINK = 'link',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
}

export enum DropzoneType {
  DEFAULT = 'default',
  STANDARD = 'standard',
}

// ==============================|| THEME CONFIG ||============================== //

const config: DefaultConfigProps = {
  fontFamily: publicSans.style.fontFamily,
  i18n: 'en',
  menuOrientation: MenuOrientation.VERTICAL,
  miniDrawer: false,
  container: true,
  mode: ThemeMode.LIGHT,
  presetColor: 'default',
  themeDirection: ThemeDirection.LTR,
};

export const filterOperators: Record<string, string> = {
  _id: 'like',
  name: 'like',
  createdAt: 'date',
  amount: 'range',
  tags: 'like',
  deletedAt: 'exists',
  phone: 'like',
  odooCustomerId: 'range',
  totalPoints: 'range',
  points: 'range',
  redeemedPoints: 'range',
  addedInOdoo: 'eq',
  title: 'like',
  user_name: 'like',
  performedBy_name: 'like',
  redeemedBy_name: 'like',
  gift_name: 'like',
  status: 'eq',
  isExpired: 'eq',
  role_name: 'like',
  customerPhone: 'like',
  invoiceNo: 'like',
  type: 'eq',
};

export default config;
