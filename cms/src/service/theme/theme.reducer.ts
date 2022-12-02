import { getLocalStorage, setLocalStorage } from '@core/storage';
import { DirectionType } from 'antd/lib/config-provider';
import { Theme } from 'antd/lib/config-provider/context';
import { SizeType } from 'antd/lib/config-provider/SizeContext';
import { atom, selector } from 'recoil';

type ThemeName = 'light' | 'dark';

type StorageType = {
  theme: ThemeName;
  tableRange: SizeType;
  siteDirection: DirectionType;
  siteColor: Theme;
};

const siteColorDefault: Theme = {
  errorColor: '#FF4D4F',
  infoColor: '#1890FF',
  primaryColor: '#FF8A00',
  processingColor: '#FF8A00',
  successColor: '#52C41A',
  warningColor: '#FAAD14',
};

export const storageState = atom<StorageType>({
  key: 'localStorageState',
  default: getLocalStorage(),
});

export const themeState = selector<ThemeName>({
  key: 'themeState',
  get: ({ get }) => get(storageState)?.theme || 'light',
  set: ({ get, set }, newValue = 'light') => {
    const data = { ...get(storageState), theme: newValue as ThemeName };
    set(storageState, data);
    setLocalStorage(data);
  },
});

export const tableRangeState = selector<SizeType>({
  key: 'tableRangeState',
  get: ({ get }) => get(storageState)?.tableRange || 'middle',
  set: ({ get, set }, newValue = 'middle') => {
    const data = { ...get(storageState), tableRange: newValue as SizeType };
    set(storageState, data);
    setLocalStorage(data);
  },
});

export const siteColorState = selector<Theme>({
  key: 'siteColorState',
  get: ({ get }) => ({ ...siteColorDefault, ...get(storageState)?.siteColor }),
  set: ({ get, set }, newValue = siteColorDefault) => {
    const data = { ...get(storageState), siteColor: newValue as Theme };
    set(storageState, data);
    setLocalStorage(data);
  },
});

export const siteDirectionState = selector<DirectionType>({
  key: 'siteDirectionState',
  get: ({ get }) => get(storageState)?.siteDirection || 'ltr',
  set: ({ get, set }, newValue = 'ltr') => {
    const data = { ...get(storageState), siteDirection: newValue as DirectionType };
    set(storageState, data);
    setLocalStorage(data);
  },
});
