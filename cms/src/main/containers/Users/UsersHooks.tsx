import { useColumnSearchProps } from '@hooks/useTableHooks';
import { userRoleTextState, userStatusTextState } from '@service/user/user.reducer';
import { UserType } from '@service/user/user.types';
import { Avatar, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import md5 from 'md5';
import { useMemo } from 'react';
import { Edit } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

export type FormType = {
  Role_Ref: number;
  UserName: string;
  Email: string;
  Password: string;
  IsAdministrator: boolean;
  FirstName: string;
  LastName: string;
  FullName: string;
};

export const initialValues: FormType = {
  Role_Ref: 0,
  UserName: '',
  Email: '',
  Password: '',
  IsAdministrator: false,
  FirstName: '',
  LastName: '',
  FullName: '',
};

export const useCurrentValues = (user: UserType) => {
  const {
    Id,
    Role,
    UserName = '',
    Email = '',
    IsAdministrator,
    FirstName,
    LastName,
    FullName,
  } = user;

  return {
    Id,
    Role_Ref: Role?.Id,
    UserName,
    Email,
    IsAdministrator,
    FirstName,
    LastName,
    FullName,
  };
};

export const useColumns = (): ColumnsType<object> => {
  const navigate = useNavigate();

  const { contents: userRoleText } = useRecoilValueLoadable(userRoleTextState);
  const { contents: userStatusText } = useRecoilValueLoadable(userStatusTextState);

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'avatar',
        dataIndex: 'Email',
        render: (o) => (
          <Avatar
            size="large"
            shape="square"
            src={`https://www.gravatar.com/avatar/${md5(o)}?d=identicon&s=100`}
          />
        ),
        width: 70,
      },
      {
        key: 'UserName',
        title: t('users:data.login'),
        dataIndex: 'UserName',
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'FullName',
        title: t('users:data.name'),
        dataIndex: 'FullName',
        render: (o) => o || '—',
        width: 250,
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Email',
        title: t('users:data.email'),
        dataIndex: 'Email',
        render: (o) => <a href={`mailto:${o}`}>{o}</a>,
        width: 250,
        sorter: true,
        ...useColumnSearchProps(),
      },
      {
        key: 'Role',
        title: t('users:data.role'),
        dataIndex: ['Role', 'Name'],
        render: (o) => (
          <Tag color={userRoleText?.[o]?.Color}>{userRoleText?.[o]?.Value || '—'}</Tag>
        ),
        width: 140,
      },
      {
        key: 'UserSections',
        title: t('users:data.status'),
        dataIndex: 'UserSections',
        render: (o) => (
          <Tag color={userRoleText?.[o]?.Color}>{userStatusText?.[o]?.Value || '—'}</Tag>
        ),
        width: 140,
      },
      {
        key: 'actions',
        dataIndex: 'Id',
        align: 'center',
        fixed: 'right',
        render: (o) => (
          <Tooltip title={t('common:actions.edit')}>
            <Typography.Link onClick={() => navigate(`/users/${o}/update`)}>
              <Edit size={15} />
            </Typography.Link>
          </Tooltip>
        ),
        width: 70,
      },
    ],
    [navigate, userRoleText, userStatusText],
  );

  return columns;
};
