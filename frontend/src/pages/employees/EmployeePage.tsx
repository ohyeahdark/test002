import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api';
import type { Employee, Department, Position } from '../../types';
import { EmployeeModal } from '../../modals/employees/EmployeeModal';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';

const EmployeePage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [allPositions, setAllPositions] = useState<Position[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const loadInitialData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [employeesRes, departmentsRes, positionsRes] = await Promise.all([
        api.get('/employees'),
        api.get('/departments'),
        api.get('/positions'),
      ]);
      setEmployees(employeesRes.data);
      setDepartments(departmentsRes.data);
      setAllPositions(positionsRes.data);
    } catch (err) { console.error("Failed to load data", err); }
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadInitialData(); }, [loadInitialData]);

  const handleSave = async (employeeData: Partial<Employee>) => {
    try {
      if (editingEmployee) {
        await api.patch(`/employees/${employeeData.id}`, employeeData);
      } else {
        await api.post('/employees', employeeData);
      }
      loadInitialData();
      closeModal();
    } catch (err) { alert('Đã xảy ra lỗi khi lưu thông tin.'); }
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await api.delete(`/employees/${employeeId}`);
        loadInitialData();
      } catch (err) { alert('Đã xảy ra lỗi khi xóa nhân viên.'); }
    }
  };

  const openModalForEdit = (employee: Employee) => {
    setEditingEmployee(employee); setIsModalOpen(true);
  };
  const openModalForAdd = () => {
    setEditingEmployee(null); setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false); setEditingEmployee(null);
  };

  return (
    <>
      <PageBreadCrumb pageTitle="Quản lý Nhân viên" />
      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-4 flex justify-end">
          <button onClick={openModalForAdd} className="px-5 py-2 rounded-md bg-primary text-white font-medium hover:bg-opacity-90 flex items-center gap-2">
            <i className="fas fa-plus"></i> Thêm Nhân viên
          </button>
        </div>
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Nhân viên</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Phòng ban</th>
                <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">Chức vụ</th>
                <th className="px-4 py-4 font-medium text-black dark:text-white">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={4} className="text-center p-8">Đang tải...</td></tr>
              ) : employees.map((employee) => (
                <tr key={employee.id}>
                  <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                    <h5 className="font-medium text-black dark:text-white">{employee.name}</h5>
                    <p className="text-sm">{employee.email}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{employee.department.name}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <p className="text-black dark:text-white">{employee.position.name}</p>
                  </td>
                  <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                    <div className="flex items-center space-x-3.5">
                      <button onClick={() => openModalForEdit(employee)} className="hover:text-primary"><i className="fas fa-pencil-alt"></i></button>
                      <button onClick={() => handleDelete(employee.id)} className="hover:text-primary"><i className="fas fa-trash-alt"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {isModalOpen && <EmployeeModal employee={editingEmployee} onClose={closeModal} onSave={handleSave} departments={departments} allPositions={allPositions} />}
    </>
  );
};

export default EmployeePage;