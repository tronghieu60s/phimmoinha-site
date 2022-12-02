import { Pagination } from '@const/types';
import { atom, selector, selectorFamily } from 'recoil';
import { getRole, getRoles } from './role.model';
import { GetListRolesParams, RoleType } from './role.types';

export const forceRefreshRolesState = atom<{}>({
  key: 'forceRefreshRolesState',
  default: {},
});

export const rolesState = selectorFamily<Pagination<RoleType> | null, GetListRolesParams>({
  key: 'rolesState',
  get:
    (args) =>
    async ({ get }) => {
      get(forceRefreshRolesState);
      const items = await getRoles(args).then((res) => res.roles.Data);
      return items;
    },
});

export const roleIdState = atom<number | null>({
  key: 'roleIdState',
  default: null,
});

export const roleSelectedState = selector<RoleType | null>({
  key: 'roleSelectedState',
  get: async ({ get }) => {
    const roleId = get(roleIdState);
    if (!roleId) {
      return null;
    }
    const item = await getRole({ id: roleId }).then((res) => res.role.Data);
    return item;
  },
});
