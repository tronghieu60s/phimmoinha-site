import { Pagination } from '@const/types';
import { convertArrayToObject } from '@core/commonFuncs';
import { getLibraries } from '@service/library/library.model';
import { getUser, getUsers } from '@service/user/user.model';
import { atom, selector, selectorFamily } from 'recoil';
import { LibraryType } from '../library/library.types';
import { GetListUsersParams, UserType } from './user.types';

export const userState = selectorFamily<UserType | null, number>({
  key: 'userState',
  get: (id) => async () => {
    const item = await getUser({ id }).then((res) => res.user.Data);
    return item;
  },
});

export const usersState = selectorFamily<Pagination<UserType> | null, GetListUsersParams>({
  key: 'usersState',
  get: (args) => async () => {
    const items = await getUsers(args).then((res) => res.users.Data);
    return items;
  },
});

export const userLibrariesState = atom<Pagination<LibraryType>>({
  key: 'userLibrariesState',
  default: (async () => {
    const items = await getLibraries({ filter: { Type: { Stw: 'User' } } }).then(
      (res) => res.libraries.Data,
    );
    return items;
  })(),
});

export const userRoleTextState = selector<{ [key: string]: string }[]>({
  key: 'userRoleTextState',
  get: ({ get }) => {
    const libraries = get(userLibrariesState);
    const items = libraries.Items.filter((item) => item.Type === 'UserRole');
    return convertArrayToObject(items, 'Key');
  },
});

export const userStatusTextState = selector<{ [key: string]: string }[]>({
  key: 'userStatusTextState',
  get: ({ get }) => {
    const libraries = get(userLibrariesState);
    const items = libraries.Items.filter((item) => item.Type === 'UserStatus');
    return convertArrayToObject(items, 'Key');
  },
});
