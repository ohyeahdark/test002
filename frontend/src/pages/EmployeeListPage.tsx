import { useState, useEffect, useCallback } from 'react';
import { api } from '../api';
import { type Employee } from '../types';
import { EmployeeModal } from '../components/EmployeeModal';

export function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  
  const departments = ['Kỹ thuật', 'Nhân sự', 'Kinh doanh', 'Marketing'];
  const positions: Record<string, string[]> = {
    'Kỹ thuật': ['Lập trình viên Backend', 'Lập trình viên Frontend', 'Tester', 'DevOps'],
    'Nhân sự': ['Chuyên viên Tuyển dụng', 'Chuyên viên C&B', 'HR Admin'],
    'Kinh doanh': ['Trưởng phòng Kinh doanh', 'Nhân viên Kinh doanh'],
    'Marketing': ['Trưởng nhóm Marketing', 'Chuyên viên SEO', 'Content Creator']
  };

  const loadEmployees = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/employees');
      setEmployees(response.data);
    } catch (err) { console.error(err); } 
    finally { setIsLoading(false); }
  }, []);

  useEffect(() => { loadEmployees(); }, [loadEmployees]);

  const handleSave = async (employeeData: Partial<Employee>) => {
    try {
      if (editingEmployee) {
        await api.patch(`/employees/${employeeData.id}`, employeeData);
      } else {
        await api.post('/employees', employeeData);
      }
      loadEmployees();
      closeModal();
    } catch (err) { alert('Đã xảy ra lỗi khi lưu thông tin.'); }
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await api.delete(`/employees/${employeeId}`);
        loadEmployees();
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
      <div className="bg-surface rounded-xl shadow-soft">
        <div className="p-6">
            <h3 className="text-lg font-bold text-heading">Authors Table</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm">
                <thead>
                    <tr className="text-left text-gray-500 font-bold uppercase">
                        <th className="p-4">Author</th>
                        <th className="p-4">Function</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Employed</th>
                        <th className="p-4">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={5} className="text-center p-8">Loading...</td></tr>
                    ) : employees.map((employee) => (
                        <tr key={employee.id} className="border-t border-gray-200">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-gray-200"></div>
                                    <div>
                                        <p className="font-bold text-heading">{employee.name}</p>
                                        <p className="text-xs text-secondary">{employee.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="p-4">
                                <p className="font-semibold text-secondary">{employee.position}</p>
                                <p className="text-xs text-secondary">{employee.department}</p>
                            </td>
                            <td className="p-4">
                                <span className="px-2 py-1 text-xs font-bold rounded-full bg-green-100 text-green-600">
                                    Online
                                </span>
                            </td>
                            <td className="p-4 text-secondary font-semibold">
                                {new Date(employee.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-4 text-secondary font-semibold">
                                <a href="#" onClick={(e) => {e.preventDefault(); openModalForAdd();}} className="hover:text-primary">Add</a>
                            </td>
                            <td className="p-4 text-secondary font-semibold">
                                <a href="#" onClick={(e) => {e.preventDefault(); openModalForEdit(employee);}} className="hover:text-primary">Edit</a>
                            </td>
                            <td className="p-4 text-secondary font-semibold">
                                <a href="#" onClick={(e) => {e.preventDefault(); handleDelete(employee.id);}} className="hover:text-primary">Delete</a>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
      {isModalOpen && <EmployeeModal employee={editingEmployee} onClose={closeModal} onSave={handleSave} departments={departments} positions={positions} />}
    </>
  );
}