import { getAuth, setAuth } from '@core/storage';
import { GetResult } from '@fingerprintjs/fingerprintjs';
import { UserType } from '@service/user/user.types';
import { atom, selector } from 'recoil';
import { SignInType } from './auth.types';

export const authStateAtom = atom<SignInType>({
  key: 'authStateAtom',
  default: getAuth(),
});

export const authServiceState = atom<GetResult>({
  key: 'authServiceState',
  default: undefined,
});

export const authState = selector<SignInType>({
  key: 'authState',
  get: ({ get }) => get(authStateAtom),
  set: ({ set }, newValue) => {
    set(authStateAtom, newValue);
    setAuth(newValue);
  },
});

export const accessUserState = selector<UserType>({
  key: 'accessUserState',
  get: ({ get }) => get(authStateAtom)?.User,
});

export const accessTokenState = selector<string>({
  key: 'accessTokenState',
  get: ({ get }) => get(authStateAtom)?.AccessToken,
});
