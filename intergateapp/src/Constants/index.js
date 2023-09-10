import { Platform } from 'react-native';

import * as DEFAULT_IOS from './index.ios'
import * as DEFAULT_ANDROID from './index.android';

export const DEFAULT_CONSTANTS = Platform.OS === 'ios' ? DEFAULT_IOS : DEFAULT_ANDROID;
/*
export const DEFAULT_CONSTANTS2 = Platform.select({
  ios: DEFAULT_IOS,
  android: DEFAULT_ANDROID
});
*/

