import { Pagination } from '@const/types';
import { atom, selector, selectorFamily } from 'recoil';
import { getPermission, getPermissions } from './permission.model';
import { GetListPermissionsParams, PermissionType } from './permission.types';

export const forceRefreshPermissionsState = atom<{}>({
  key: 'forceRefreshPermissionsState',
  default: {},
});

export const permissionsState = selectorFamily<
  Pagination<PermissionType> | null,
  GetListPermissionsParams
>({
  key: 'permissionsState',
  get:
    (args) =>
    async ({ get }) => {
      get(forceRefreshPermissionsState);
      const items = await getPermissions(args).then((res) => res.permissions.Data);
      return items;
    },
});

export const permissionIdState = atom<number | null>({
  key: 'permissionIdState',
  default: null,
});

export const permissionSelectedState = selector<PermissionType | null>({
  key: 'permissionSelectedState',
  get: async ({ get }) => {
    const permissionId = get(permissionIdState);
    if (!permissionId) {
      return null;
    }
    const item = await getPermission({ id: permissionId }).then((res) => res.permission.Data);
    return item;
  },
});
