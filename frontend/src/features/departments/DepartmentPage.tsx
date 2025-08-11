import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../../types';
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from './departmentAPI';
import { DepartmentModal } from './DepartmentModal';
import { DataTable } from '../../components/common/DataTable';

const DepartmentPage = () => {
  const { t } = useTranslation();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Partial<Department> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState('');

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const data = await getDepartments({ page, keyword });
      if (Array.isArray(data)) {
        setDepartments(data);
        setTotal(data.total);
      } else {
        console.error("API /departments không trả về một mảng:", data);
        setDepartments([]);
        setTotal(1);
      }
    } catch (err) {
      console.error(t('department.fetchError'), err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, [page, keyword]);

  const handleAdd = () => {
    setSelectedDepartment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (department: Department) => {
    setSelectedDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('department.confirmDelete'))) return;
    try {
      await deleteDepartment(id);
      await fetchDepartments();
    } catch (err) {
      alert(t('department.deleteFailed'));
      console.error(err);
    }
  };

  const handleSave = async (data: Partial<Department>) => {
    try {
      if (data.id) {
        await updateDepartment(data.id, data);
      } else {
        await createDepartment({ name: data.name! });
      }
      setIsModalOpen(false);
      await fetchDepartments();
    } catch (err) {
      alert(t('department.saveFailed'));
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">{t('department.title')}</h1>
        <button
          onClick={handleAdd}
          className="bg-primary text-black dark:text-white px-4 py-2 rounded-lg hover:bg-opacity-90"
        >
          + {t('common.add')}
        </button>
      </div>

      <DataTable
        data={Array.isArray(departments) ? departments : []}
        loading={loading}
        onSearch={(kw) => {
          setKeyword(kw);
          setPage(1);
        }}
        columns={[
          {
            title: t('department.fields.index'),
            className: 'text-center',
            render: (_, i) => i + 1,
          },
          {
            title: t('department.fields.name'),
            className: 'text-center',
            render: (item) => item.name,
          },
          {
            title: t('department.fields.action'),
            className: 'text-center',
            render: (item) => (
              <div className="space-x-2 text-center">
                <button
                  onClick={() => handleEdit(item)}
                  className="text-sm px-3 py-1 bg-yellow-400 text-white rounded hover:opacity-90"
                >
                  {t('common.edit')}
                </button>
                <button
                  onClick={() => handleDelete(item.id!)}
                  className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:opacity-90"
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

      {isModalOpen && (
        <DepartmentModal
          department={selectedDepartment}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DepartmentPage;