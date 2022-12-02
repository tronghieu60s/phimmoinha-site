import { FormInputText } from '@common/Base/Form/FormInput';
import { UploadChangeParam } from '@const/types';
import { capitalize } from '@core/commonFuncs';
import { useColumnSearchProps } from '@hooks/useTableHooks';
import { movieStatusTextState, movieTypeTextState } from '@service/movie/movie.reducer';
import {
  MovieEpisodeType,
  MovieMetaType,
  MovieStatusType,
  MovieType,
} from '@service/movie/movie.types';
import { TaxonomyType } from '@service/taxonomy/taxonomy.types';
import { Avatar as AvatarImage, Space, Tag, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table/interface';
import { t } from 'i18next';
import moment, { Moment } from 'moment';
import { ChangeEvent, useMemo } from 'react';
import { ArrowDownCircle, ArrowUpCircle, Edit, RotateCcw } from 'react-feather';
import { useNavigate } from 'react-router-dom';
import { useRecoilValueLoadable } from 'recoil';

export type FormType = {
  Type: MovieMetaType;
  Title: string;
  Content: string;
  Slug: string;
  Status: MovieStatusType;
  Avatar: UploadChangeParam;
  Original: string;
  Duration: number;
  Quality: string;
  Quantity: number;
  Trailer: string;
  Publish: Moment | null;
  DatePublish: Moment | null;
  Episodes: MovieEpisodeType[];
  Tags: (string | number)[];
  Categories: (string | number)[];
  Casts: (string | number)[];
  Directors: (string | number)[];
  Countries: (string | number)[];
};

export const initialValues: FormType = {
  Type: 'Movie',
  Title: '',
  Content: '',
  Slug: '',
  Status: 'Draft',
  Avatar: { fileList: [] },
  Original: '',
  Duration: 0,
  Quality: '',
  Quantity: 1,
  Trailer: '',
  Publish: null,
  DatePublish: null,
  Episodes: [],
  Tags: [],
  Categories: [],
  Casts: [],
  Directors: [],
  Countries: [],
};

export const useFormValues = async (values: FormType) => {
  const {
    Type,
    Title,
    Content,
    Slug,
    Status,
    Avatar,
    Original,
    Duration,
    Quality,
    Quantity,
    Trailer,
    Publish,
    DatePublish,
    Episodes: DefaultEpisodes,
    Tags,
    Categories,
    Casts,
    Directors,
    Countries,
  } = values;

  const Episodes = DefaultEpisodes.map((eps) => {
    const o: any = { ...eps };
    delete o.Key;
    // eslint-disable-next-line no-underscore-dangle, no-param-reassign
    delete o.__typename;
    return o;
  });

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
        Number(category) ? { Id: Number(category) } : { Type: 'Movie_Category', Name: category },
      ) as TaxonomyType[],
    );
  }

  if (Casts.length > 0) {
    Taxonomies = Taxonomies.concat(
      Casts.map((cast) =>
        Number(cast) ? { Id: Number(cast) } : { Type: 'Cast', Name: cast },
      ) as TaxonomyType[],
    );
  }

  if (Directors.length > 0) {
    Taxonomies = Taxonomies.concat(
      Directors.map((director) =>
        Number(director) ? { Id: Number(director) } : { Type: 'Director', Name: director },
      ) as TaxonomyType[],
    );
  }

  if (Countries.length > 0) {
    Taxonomies = Taxonomies.concat(
      Countries.map((country) =>
        Number(country) ? { Id: Number(country) } : { Type: 'Country', Name: country },
      ) as TaxonomyType[],
    );
  }

  return {
    Type,
    Title,
    Content,
    Slug,
    Status,
    Avatar: String(Avatar?.fileList?.[0] || ''),
    Original,
    Duration: Number(Duration) || 0,
    Quality,
    Quantity: Number(Quantity) || 0,
    Trailer,
    Publish: Number(moment(Publish).format('YYYY')) || 0,
    DatePublish: moment(DatePublish || moment()).format('YYYY-MM-DD HH:mm:ss'),
    Episodes,
    Taxonomies,
  };
};

export const useCurrentValues = (movie: MovieType): FormType => {
  const {
    Type = 'Movie',
    Title = '',
    Content = '',
    Slug = '',
    Status = 'Draft',
    Original = '',
    Duration = 0,
    Quality = '',
    Quantity = 1,
    Trailer = '',
    Publish = 0,
    DatePublish,
    Episodes = [],
    Taxonomies = [],
  } = movie;

  const Tags = Taxonomies?.filter((o) => o.Type === 'Tag').map((o) => Number(o.Id)) || [];
  const Categories =
    Taxonomies?.filter((o) => o.Type === 'Movie_Category').map((o) => Number(o.Id)) || [];
  const Casts = Taxonomies?.filter((o) => o.Type === 'Cast').map((o) => Number(o.Id)) || [];
  const Directors = Taxonomies?.filter((o) => o.Type === 'Director').map((o) => Number(o.Id)) || [];
  const Countries = Taxonomies?.filter((o) => o.Type === 'Country').map((o) => Number(o.Id)) || [];

  return {
    Type,
    Title,
    Content,
    Slug,
    Status,
    Avatar: { fileList: [] },
    Original,
    Duration,
    Quality,
    Quantity,
    Trailer,
    Publish: moment(Publish, 'YYYY'),
    DatePublish: moment(DatePublish),
    Episodes,
    Tags,
    Categories,
    Casts,
    Directors,
    Countries,
  };
};

type Props = {
  onRecoverItems: (ids: string[]) => void;
};

export const useColumns = (props: Props): ColumnsType<object> => {
  const { onRecoverItems } = props;
  const navigate = useNavigate();

  const { contents: movieTypeText } = useRecoilValueLoadable(movieTypeTextState);
  const { contents: movieStatusText } = useRecoilValueLoadable(movieStatusTextState);

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Avatar',
        dataIndex: 'Avatar',
        width: 70,
        render: (o) => <AvatarImage size="large" shape="square" src={o} />,
      },
      {
        key: 'Title',
        title: t('movies:data.title'),
        dataIndex: 'Title',
        sorter: true,
        render: (o, r: MovieType) => (
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
        title: t('movies:data.author'),
        dataIndex: ['User', 'UserName'],
        width: 120,
      },
      {
        key: 'Taxonomies',
        title: t('movies:data.categories'),
        dataIndex: 'Taxonomies',
        render: (taxonomies: TaxonomyType[]) => (
          <Space size={5} wrap>
            {taxonomies
              ?.filter((o) => o.Type === 'Movie_Category')
              ?.map((o) => <Tag key={o.Id}>{o.Name}</Tag>) || '—'}
          </Space>
        ),
        width: 200,
      },
      {
        key: 'Type',
        title: t('movies:data.type'),
        dataIndex: 'Type',
        sorter: true,
        render: (o) => (
          <Tag color={movieTypeText?.[o]?.Color}>{movieTypeText?.[o]?.Value || o || '—'}</Tag>
        ),
        width: 140,
      },
      {
        key: 'Quantity',
        title: t('movies:data.quantity'),
        dataIndex: 'EpisodesCount',
        render: (o: string) => (
          <Typography.Text>{`${o || 0} ${t('movies:data.episode')}`}</Typography.Text>
        ),
        width: 120,
      },
      {
        key: 'QuantityExpected',
        title: t('movies:data.quantity.expected'),
        dataIndex: 'Quantity',
        render: (o: string, r: MovieType) => (
          <Typography.Text
            {...((r.EpisodesCount || 0) > (o || 0) && { type: 'danger', strong: true })}
          >
            {`${o || 0} ${t('movies:data.episode')}`}
          </Typography.Text>
        ),
        width: 120,
      },
      {
        key: 'Status',
        title: t('movies:data.status'),
        dataIndex: 'Status',
        sorter: true,
        render: (o) => (
          <Tag color={movieStatusText?.[o]?.Color}>{movieStatusText?.[o]?.Value || o || '—'}</Tag>
        ),
        width: 140,
      },
      {
        key: 'DateModified',
        title: t('movies:data.date'),
        dataIndex: 'DateModified',
        render: (o, r: MovieType) => (
          <Space size={3} direction="vertical">
            <Typography.Text style={{ fontSize: 13 }}>
              {movieStatusText?.[r.Status === 'Published' ? 'Published' : 'Others']?.Value ||
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
        render: (o, r: MovieType) =>
          r.Status === 'Trash' ? (
            <Tooltip title={t('common:actions.recover')}>
              <Typography.Link onClick={() => onRecoverItems([o])}>
                <RotateCcw size={15} />
              </Typography.Link>
            </Tooltip>
          ) : (
            <Tooltip title={t('common:actions.edit')}>
              <Typography.Link onClick={() => navigate(`/movies/${o}/update`)}>
                <Edit size={15} />
              </Typography.Link>
            </Tooltip>
          ),
        width: 70,
      },
    ],
    [movieTypeText, movieStatusText, onRecoverItems, navigate],
  );

  return columns;
};

type EpsProps = {
  onChangeItem: (e: ChangeEvent<HTMLInputElement>) => void;
  onMoveNextItem: (key: string) => void;
  onMovePreviousItem: (key: string) => void;
};

export const useEpisodesColumns = (props: EpsProps): ColumnsType<object> => {
  const { onChangeItem, onMoveNextItem, onMovePreviousItem } = props;

  const columns: ColumnsType<object> = useMemo(
    () => [
      {
        key: 'Title',
        title: t('movies:data.episode.title'),
        dataIndex: 'Title',
        render: (o: string, r: MovieEpisodeType) => (
          <FormInputText
            id={r.Key}
            name="Title"
            placeholder=""
            className={`ant-editable-cell${o ? '' : ' active'}`}
            value={o}
            onChange={onChangeItem}
          />
        ),
        width: '15%',
      },
      {
        key: 'Slug',
        title: t('movies:data.episode.slug'),
        dataIndex: 'Slug',
        render: (o: string, r: MovieEpisodeType) => (
          <FormInputText
            id={r.Key}
            name="Slug"
            placeholder=""
            className={`ant-editable-cell${o ? '' : ' active'}`}
            value={o}
            onChange={onChangeItem}
          />
        ),
        width: '15%',
      },
      {
        key: 'Source',
        title: t('movies:data.episode.source'),
        dataIndex: 'Source',
        render: (o: string, r: MovieEpisodeType) => (
          <FormInputText
            id={r.Key}
            name="Source"
            placeholder=""
            className={`ant-editable-cell${o ? '' : ' active'}`}
            value={o}
            onChange={onChangeItem}
          />
        ),
        width: '30%',
      },
      {
        key: 'Date',
        title: t('movies:data.date'),
        dataIndex: 'Date',
        width: '15%',
        render: (o: string) => (
          <Typography.Text>{o ? moment(o).format('HH:mm:ss, DD/MM/YYYY') : '—'}</Typography.Text>
        ),
      },
      {
        key: 'actions',
        dataIndex: 'Key',
        align: 'center',
        fixed: 'right',
        render: (o: string) => (
          <Space>
            <Tooltip title={t('common:actions.move.next')}>
              <Typography.Link onClick={() => onMoveNextItem(o)}>
                <ArrowDownCircle size={15} />
              </Typography.Link>
            </Tooltip>
            <Tooltip title={t('common:actions.move.previous')}>
              <Typography.Link onClick={() => onMovePreviousItem(o)}>
                <ArrowUpCircle size={15} />
              </Typography.Link>
            </Tooltip>
          </Space>
        ),
        width: 70,
      },
    ],
    [onChangeItem, onMoveNextItem, onMovePreviousItem],
  );

  return columns;
};
