import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Plus } from 'lucide-react';
import { DataTable } from '../../components/common/DataTable';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import LeaveModal from './LeaveModal';
import { myLeaves, cancelLeave, getLeaveTypes } from './leaveAPI';
import type { LeaveRequest, LeaveType } from './leaveAPI';

const PAGE_SIZE = 10;

const MyLeavesPage = () => {
  const { t } = useTranslation();

  const [rows, setRows] = useState<LeaveRequest[]>([]);
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Partial<LeaveRequest> | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [list, tps] = await Promise.all([myLeaves(), getLeaveTypes()]);
      const leaveItems: LeaveRequest[] = Array.isArray(list)
        ? (list as LeaveRequest[])
        : ((((list as any)?.['items']) as LeaveRequest[]) ?? []);
      const typeOpts: LeaveType[] = Array.isArray(tps)
        ? (tps as LeaveType[])
        : ((((tps as any)?.['items']) as LeaveType[]) ?? []);
      setRows(leaveItems);
      setTypes(typeOpts);
    } catch (err) {
      console.error(err);
      setRows([]);
      setTypes([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useDebouncedEffect(() => {
    setKeyword(search.trim());
    setPage(1);
  }, [search], 500);

  const filtered = useMemo(() => {
    if (!keyword) return rows;
    const kw = keyword.toLowerCase();
    return rows.filter((r) => {
      const typeName = types.find((t) => t.id === r.typeId)?.name || '';
      return (
        (r.reason || '').toLowerCase().includes(kw) ||
        typeName.toLowerCase().includes(kw) ||
        new Date(r.startDate).toLocaleDateString().toLowerCase().includes(kw) ||
        new Date(r.endDate).toLocaleDateString().toLowerCase().includes(kw)
      );
    });
  }, [rows, types, keyword]);

  const pageData = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  useEffect(() => {
    setTotal(filtered.length);
  }, [filtered]);

  const handleCancel = async (id: string) => {
    if (!window.confirm(t('leave.confirmCancel', 'Bạn có chắc muốn huỷ đơn này?'))) return;
    setBusyId(id);
    try {
      await cancelLeave(id);
      await fetchData();
    } finally {
      setBusyId(null);
    }
  };

  const getTypeName = (id?: string) => types.find((d) => d.id === id)?.name || '';

  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('leave.title', 'Đơn nghỉ của tôi')}</h2>
        <button
          onClick={() => { setSelectedLeave(null); setIsModalOpen(true); }}
          className="inline-flex items-center gap-2 rounded-md dark:bg-black bg-white px-3 py-2 text-sm dark:text-white text-black hover:opacity-90"
        >
          <Plus className="h-4 w-4" /> {t('common.add', 'Thêm')}
        </button>
      </div>

      <DataTable
        data={pageData}
        loading={loading}
        onSearch={(kw) => setSearch(kw)}
        onEdit={(e) => { setSelectedLeave(e); setIsModalOpen(true); }}
        onDelete={(e) => handleCancel(e.id!)}
        columns={[
          { title: t('leave.fields.index'), className: 'text-center', render: (_: any, i: number) => (page - 1) * PAGE_SIZE + i + 1 },
          { title: t('leave.fields.type'), className: 'text-center', key: 'typeId', render: (e: LeaveRequest) => getTypeName(e.typeId) },
          { title: t('leave.fields.startDate'), className: 'text-center', key: 'startDate', render: (e: LeaveRequest) => `${new Date(e.startDate).toLocaleString()}` },
          { title: t('leave.fields.endDate'), className: 'text-center', key: 'endDate', render: (e: LeaveRequest) => `${new Date(e.endDate).toLocaleString()}` },
          { title: t('leave.fields.reason'), className: 'text-center', key: 'reason', render: (e: LeaveRequest) => e.reason || '' },
          {
            title: t('leave.fields.status'),
            className: 'text-center',
            key: 'status',
            render: (e: LeaveRequest) => (
              <span className="inline-flex items-center gap-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${e.status === 'APPROVED' ? 'bg-green-500' :
                      e.status === 'REJECTED' ? 'bg-red-500' :
                        e.status === 'CANCELED' ? 'bg-gray-400' : 'bg-yellow-500'
                    }`}
                />
                {t(`common.${e.status.toLowerCase()}`, e.status)}
              </span>
            ),
          },
          { title: t('leave.fields.createdAt'), className: 'text-center', key: 'createdAt', render: (e: LeaveRequest) => new Date(e.createdAt).toLocaleString() },
          {
            title: t('leave.fields.action'),
            className: 'text-center',
            render: (item: LeaveRequest) => (
              <div className="space-x-2 text-center">
                {item.status === 'PENDING' ? (
                  <>
                    <button
                      onClick={() => { setSelectedLeave(item); setIsModalOpen(true); }}
                      className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:opacity-90"
                    >
                      {t('common.edit')}
                    </button>
                    <button
                      onClick={() => handleCancel(item.id!)}
                      disabled={busyId === item.id}
                      className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:opacity-90 disabled:opacity-60"
                    >
                      {t('common.cancel')}
                    </button>
                  </>
                ) : (
                  <span className="text-xs text-gray-400">—</span>
                )}
              </div>
            ),
          },
        ]}
        pagination={{
          page,
          pageSize: PAGE_SIZE,
          totalCount: total,
          onPageChange: setPage,
          serverSide: true,
        }}
      />

      {isModalOpen && (
        <LeaveModal
          open={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          initial={selectedLeave ?? undefined}
          onSaved={() => {
            setIsModalOpen(false);
            fetchData();
          }}
        />
      )}
    </div>
  );
};

export default MyLeavesPage;
