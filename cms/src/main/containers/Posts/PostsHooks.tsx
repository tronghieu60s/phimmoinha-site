import { UploadChangeParam } from '@const/types';
import { capitalize } from '@core/commonFuncs';
import { useColumnSearchProps } from '@hooks/useTableHooks';
import { postStatusTextState } from '@service/post/post.reducer';
import { PostMetaType, PostStatusType, PostType } from '@service/post/post.types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { Avatar as AvatarImage, Space, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import moment, { Moment } from 'moment';
import { useMemo } from 'react';
import { Edit, RotateCcw } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

export type FormType = {
  Title: string;
  Content: string;
  Slug: string;
  Status: PostStatusType;
  Avatar: UploadChangeParam;
  DatePublish: Moment | null;
  Tags: (string | number)[];
  Categories: (string | number)[];
};

export const initialValues: FormType = {
  Title: '',
  Content: '',
  Slug: '',
  Status: 'Draft',
  Avatar: { fileList: [] },
  DatePublish: null,
  Tags: [],
  Categories: [],
};

export const useFormValues = async (values: FormType) => {
  const { Title, Content, Slug, Status, Avatar, DatePublish, Tags, Categories } = values;

  let Taxonomies: TaxonomyType[] = [];
  if (Tags.length > 0) {
    Taxonomies = Taxonomies.concat(
      Tags.map((tag) =>
        Number(tag) ? { Id: Number(tag) } : { Type: 'Tag', Name: tag },
      ) as TaxonomyType[],
    );
  }
  if (Categories.length > 0) {
    Taxonomies = Taxonomies.concat(
      Categories.map((category) =>
        Number(category) ? { Id: Number(category) } : { Type: 'Post_Category', Name: category },
      ) as TaxonomyType[],
    );
  }

  return {
    Title,
    Content,
    Slug,
    Status,
    Avatar: String(Avatar?.fileList?.[0] || ''),
    DatePublish: moment(DatePublish || moment()).format('YYYY-MM-DD HH:mm:ss'),
    Taxonomies,
  };
};

export const useCurrentValues = (post: PostType): FormType => {
  const { Title = '', Content = '', Slug = '', Status = 'Draft', DatePublish, Taxonomies } = post;

  const Tags = Taxonomies?.filter((o) => o.Type === 'Tag').map((o) => Number(o.Id)) || [];
  const Categories =
    Taxonomies?.filter((o) => o.Type === 'Post_Category').map((o) => Number(o.Id)) || [];

  return {
    Title,
    Content,
    Slug,
    Status,
    Avatar: { fileList: [] },
    DatePublish: moment(DatePublish),
    Tags,
    Categories,
  };
};

type Props = {
  type: PostMetaType;
  onRecoverItems: (ids: string[]) => void;
};

export const useColumns = (props: Props): ColumnsType<object> => {
  const { type, onRecoverItems } = props;
  const navigate = useNavigate();

  const { contents: postStatusText } = useRecoilValueLoadable(postStatusTextState);

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Avatar',
        dataIndex: 'Avatar',
        render: (o) => <AvatarImage size="large" shape="square" src={o} />,
        width: 70,
      },
      {
        key: 'Title',
        title: t('posts:data.title'),
        dataIndex: 'Title',
        sorter: true,
        render: (o, r: PostType) => (
          <>
            <a href="##" target="_blank" rel="noreferrer">
              {o}
            </a>
            <Typography>{`— ${capitalize(r.Slug || '')}`}</Typography>
          </>
        ),
        ...useColumnSearchProps(),
      },
      {
        key: 'Author',
        title: t('posts:data.author'),
        dataIndex: ['User', 'UserName'],
        width: 120,
      },
      {
        key: 'Taxonomies',
        title: t('posts:data.categories'),
        dataIndex: 'Taxonomies',
        render: (taxonomies: TaxonomyType[]) => (
          <Space size={5} wrap>
            {taxonomies
              ?.filter((o) => o.Type === 'Post_Category')
              ?.map((o) => <Tag key={o.Id}>{o.Name}</Tag>) || '—'}
          </Space>
        ),
        width: 200,
      },
      {
        key: 'Status',
        title: t('posts:data.status'),
        dataIndex: 'Status',
        sorter: true,
        render: (o) => (
          <Tag color={postStatusText?.[o]?.Color}>{postStatusText?.[o]?.Value || o || '—'}</Tag>
        ),
        width: 140,
      },
      {
        key: 'DateModified',
        title: t('posts:data.date'),
        dataIndex: 'DateModified',
        render: (o, r: PostType) => (
          <Space size={3} direction="vertical">
            <Typography.Text style={{ fontSize: 13 }}>
              {postStatusText?.[r.Status === 'Published' ? 'Published' : 'Others']?.Value ||
                r.Status ||
                '—'}
            </Typography.Text>
            <Typography.Text>{moment(Number(o)).format('HH:mm:ss, DD/MM/YYYY')}</Typography.Text>
          </Space>
        ),
        width: 200,
      },
      {
        key: 'actions',
        dataIndex: 'Id',
        align: 'center',
        fixed: 'right',
        render: (o, r: PostType) =>
          r.Status === 'Trash' ? (
            <Tooltip title={t('common:actions.recover')}>
              <Typography.Link onClick={() => onRecoverItems([o])}>
                <RotateCcw size={15} />
              </Typography.Link>
            </Tooltip>
          ) : (
            <Tooltip title={t('common:actions.edit')}>
              <Typography.Link onClick={() => navigate(`/${type.toLowerCase()}s/${o}/update`)}>
                <Edit size={15} />
              </Typography.Link>
            </Tooltip>
          ),
        width: 70,
      },
    ],
    [navigate, onRecoverItems, postStatusText, type],
  );

  return columns;
};
