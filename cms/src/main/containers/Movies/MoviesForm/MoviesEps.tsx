import { FormInputNumber } from '@common/Base/Form/FormInput';
import TableActions from '@common/Base/Table/TableActions';
import TableListControl from '@common/Base/Table/TableListControl';
import { MovieEpisodeType } from '@service/movie/movie.types';
import { FormInstance, Row, Space, TablePaginationConfig } from 'antd';
import { t } from 'i18next';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { useEpisodesColumns } from '../MoviesHooks';

type Props = {
  state: 'loading' | 'hasValue' | 'hasError';
  form: FormInstance<any>;
  force: any;
};

export default function MoviesEps(props: Props) {
  const { state, form, force } = props;
  const [episodes, setEpisodes] = useState<MovieEpisodeType[]>(
    form.getFieldValue('Episodes') || [],
  );

  const [index, setIndex] = useState(0);
  const [pagination, setPagination] = useState({
    total: 0,
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    form.setFieldsValue({ Episodes: episodes });
  }, [episodes, form]);

  useEffect(() => {
    let eps = form.getFieldValue('Episodes') || [];
    if (eps) {
      eps = eps?.map((ep: MovieEpisodeType) => ({ ...ep, Key: uuidv4() }));
      setEpisodes(eps);
    }
  }, [form, force]);

  useEffect(() => {
    setIndex(episodes?.length || 0);
    setPagination((prev) => ({ ...prev, total: episodes?.length || 0 }));
  }, [episodes]);

  const onChange = useCallback(
    (e: TablePaginationConfig) => {
      setPagination({
        total: pagination.total,
        current: e.current || 1,
        pageSize: e.pageSize || 10,
      });
    },
    [pagination.total],
  );

  const onAddItem = useCallback(() => {
    setEpisodes((prev) => {
      const total = prev.length;
      const lastEps = prev[total - 1];
      const numLastEps = Number(lastEps?.Title?.match(/\d+/g)?.[0] || 0) + 1 || total;

      const newEpisodes = [...prev];
      const newEpisode = {
        Key: uuidv4(),
        Title: `Tập ${numLastEps}`,
        Slug: `tap-${numLastEps}`,
        Order: total + 1,
        Date: Date.now(),
      };
      newEpisodes.splice(index, 0, newEpisode);
      return newEpisodes;
    });
    setPagination((prev) => ({ ...prev, current: Math.ceil((prev.total + 1) / prev.pageSize) }));
  }, [index]);

  const onChangeItem = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { id, name, value } = e.target;
    setEpisodes((eps) => {
      const newEpisodes = eps.map((ep) => {
        if (ep.Key === id) return { ...ep, [name]: value };
        return ep;
      });
      return newEpisodes;
    });
  }, []);

  const onMoveNextItem = useCallback((key: string) => {
    setEpisodes((prev) => {
      const newEpisodes = [...prev];
      const indexEp = newEpisodes.findIndex((ep) => ep.Key === key);
      if (indexEp === newEpisodes.length - 1) return newEpisodes;

      const temp = newEpisodes[indexEp];
      newEpisodes[indexEp] = newEpisodes[indexEp + 1];
      newEpisodes[indexEp + 1] = temp;
      return newEpisodes?.map((ep, i) => ({ ...ep, Order: i + 1 }));
    });
  }, []);

  const onMovePreviousItem = useCallback((key: string) => {
    setEpisodes((prev) => {
      const newEpisodes = [...prev];
      const indexEp = newEpisodes.findIndex((ep) => ep.Key === key);
      if (!indexEp) return newEpisodes;

      const temp = newEpisodes[indexEp];
      newEpisodes[indexEp] = newEpisodes[indexEp - 1];
      newEpisodes[indexEp - 1] = temp;
      return newEpisodes?.map((ep, i) => ({ ...ep, Order: i + 1 }));
    });
  }, []);

  return (
    <>
      <TableActions pagination={pagination} onAdd={onAddItem} className="mb-3" />
      <Row justify="end" className="mb-3">
        <Space>
          <FormInputNumber
            min={0}
            value={index}
            onChange={(e) => setIndex(Number(e.target.value))}
            placeholder={t('movies:form.input.index')}
          />
        </Space>
      </Row>
      <TableListControl
        rowKey="Key"
        loading={state === 'loading'}
        dataSource={episodes}
        columns={useEpisodesColumns({
          onChangeItem,
          onMoveNextItem,
          onMovePreviousItem,
        })}
        pagination={pagination}
        onChange={onChange}
      />
    </>
  );
}
