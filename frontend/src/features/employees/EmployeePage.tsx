import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Employee, Department, Position } from '../../types';
import {
  getEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from './employeeAPI';
import { EmployeeModal } from './EmployeeModal';
import { DataTable } from '../../components/common/DataTable';
import { getDepartments } from '../departments/departmentAPI';
import { getPositions } from '../positions/positionAPI';
import { useDebouncedEffect } from '../../hooks/useDebouncedEffect';
import { Plus } from 'lucide-react';

const EmployeePage = () => {
  const { t } = useTranslation();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<Employee> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(false);

  const [departments, setDepartments] = useState<Department[]>([]);
  const [positions, setPositions] = useState<Position[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getEmployees({ page, keyword });

      if (Array.isArray(res)) {
        setEmployees(res);
        setTotal(res.total);
      } else {
        console.error("API /employees không trả về một mảng:", res);
        setEmployees([]);
        setTotal(0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    const [deps, poss] = await Promise.all([
      getDepartments(),
      getPositions(),
    ]);
    setDepartments(deps.items || deps);
    setPositions(poss.items || poss);
  };

  useEffect(() => {
    fetchData();
  }, [page, keyword]);

  useDebouncedEffect(() => {
    setKeyword(search);
    setPage(1);
  }, [search], 1000);

  useEffect(() => {
    fetchOptions();
  }, []);

  const handleSave = async (data: Partial<Employee>) => {
    if (data.id) {
      await updateEmployee(data.id, data);
    } else {
      await createEmployee(data);
    }
    setIsModalOpen(false);
    await fetchData();
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm(t('employee.confirmDelete'))) return;
    await deleteEmployee(id);
    await fetchData();
  };

  const getDepartmentName = (id?: string) =>
    departments.find((d) => d.id === id)?.name || '';

  const getPositionName = (id?: string) =>
    positions.find((p) => p.id === id)?.name || '';

  return (
    <div className="p-6 ">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">{t('employee.title')}</h2>
        <button
          onClick={() => {
            setSelectedEmployee(null);
            setIsModalOpen(true);
          }}
            className="inline-flex items-center gap-2 rounded-md dark:bg-black bg-white px-3 py-2 text-sm dark:text-white text-black hover:opacity-90"
        >
            <Plus className="h-4 w-4" /> {t('common.add')}
        </button>
      </div>

      <DataTable
        data={Array.isArray(employees) ? employees : []}
        loading={loading}
        onSearch={(kw) => setSearch(kw)}
        onEdit={(e) => {
          setSelectedEmployee(e);
          setIsModalOpen(true);
        }}
        onDelete={(e) => handleDelete(e.id!)}
        columns={[
          { title: t('employee.fields.index'), className: 'text-center', render: (_, i) => (page - 1) * 10 + i + 1 },
          {
            title: t('employee.fields.avatar'),
            key: 'avatarUrl',
            render: (e) => (
              <img
                src={e.avatarUrl || '/images/user/default-avatar.png'}
                alt={e.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ),
          },
          { title: t('employee.fields.name'), className: 'text-center', key: 'name', sortable: true, render: (e) => e.name },
          { title: t('employee.fields.birthday'), className: 'text-center', key: 'dateOfBirth', sortable: true, render: (e) => (e.dateOfBirth + '').split('T')[0] },
          { title: t('employee.fields.email'), className: 'text-center', key: 'email', render: (e) => e.email },
          { title: t('employee.fields.department'), className: 'text-center', key: 'departmentId', render: (e) => getDepartmentName(e.departmentId) },
          { title: t('employee.fields.position'), className: 'text-center', key: 'positionId', render: (e) => getPositionName(e.positionId) },
          { title: t('employee.fields.hireDate'), className: 'text-center', key: 'hireDate', render: (e) => (e.hireDate + '').split('T')[0] },
          {
            title: t('employee.fields.status'), className: 'text-center',
            key: 'status',
            render: (e) => (
              <span className="inline-flex items-center gap-1">
                <span
                  className={`inline-block w-2 h-2 rounded-full ${e.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                />
                {e.status === 'ACTIVE' ? t('employee.status.active') : t('employee.status.onleave')}
              </span>
            ),
          },
          {
            title: t('employee.fields.action'),
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
          }
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
        <EmployeeModal
          employee={selectedEmployee}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          departments={departments}
          positions={positions}
        />
      )}
    </div>
  );
};

export default EmployeePage;
