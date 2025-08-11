import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Position } from '../../types';
import {
  getPositions,
  createPosition,
  updatePosition,
  deletePosition,
} from './positionAPI';
import { PositionModal } from './PositionModal';
import { DataTable } from '../../components/common/DataTable';

const PositionPage = () => {
  const { t } = useTranslation();
  const [positions, setPositions] = useState<Position[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Partial<Position> | null>(null);
  const [open, setOpen] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getPositions({ page, keyword });
      if (Array.isArray(res)) {
        setPositions(res);
        setTotal(res.total);
      } else {
        console.error("API /positions không trả về một mảng:", res);
        setPositions([]);
        setTotal(0);
      }
    } catch (err) {
      console.error(t('position.fetchError'), err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, keyword]);

  const handleSave = async (data: Partial<Position>) => {
    try {
      if (data.id) {
        await updatePosition(data.id, data);
      } else {
        await createPosition({ name: data.name! });
      }
      setOpen(false);
      await fetchData();
    } catch (err) {
      alert(t('position.saveFailed'));
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('position.confirmDelete'))) return;
    try {
      await deletePosition(id);
      await fetchData();
    } catch (err) {
      alert(t('position.deleteFailed'));
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">{t('position.title')}</h2>
        <button
          onClick={() => {
            setSelected(null);
            setOpen(true);
          }}
          className="bg-primary text-black dark:text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          + {t('common.add')}
        </button>
      </div>

      <DataTable
        data={Array.isArray(positions) ? positions : []}
        loading={loading}
        onSearch={(kw) => {
          setKeyword(kw);
          setPage(1);
        }}
        columns={[
          {
            title: t('position.fields.index'),
            className: 'text-center',
            render: (_, i) => (page - 1) * 10 + i + 1,
          },
          {
            title: t('position.fields.name'),
            className: 'text-center',
            key: 'name',
            sortable: true,
            render: (p) => p.name,
          },
          {
            title: t('position.fields.status'),
            className: 'text-center',
            render: (p) => (
              <div className="space-x-2">
                <button
                  onClick={() => {
                    setSelected(p);
                    setOpen(true);
                  }}
                  className="text-sm bg-yellow-400 px-3 py-1 text-white rounded"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(p.id!)}
                  className="text-sm bg-red-500 px-3 py-1 text-white rounded"
                >
                  {t('common.delete')}
                </button>
              </div>
            ),
          },
        ]}
        pagination={{
          page,
          pageSize: 10,
          totalCount: total,
          onPageChange: setPage,
          serverSide: true,
        }}
      />

      {open && (
        <PositionModal
          position={selected}
          onClose={() => setOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default PositionPage;
