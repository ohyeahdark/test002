import React, { useState, useEffect } from 'react';
import type { Employee, Department, Position } from '../../types';

interface EmployeeModalProps {
  employee: Partial<Employee> | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
  departments: Department[];
  allPositions: Position[];
}

export function EmployeeModal({ employee, onClose, onSave, departments, allPositions }: EmployeeModalProps) {
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [availablePositions, setAvailablePositions] = useState<Position[]>([]);

  useEffect(() => {
    if (employee) {
      setFormData(employee);
    } else {
      // Trạng thái mặc định cho nhân viên mới
      const defaultDeptId = departments[0]?.id || '';
      setFormData({
        employeeCode: '', name: '', email: '', phone: '',
        status: 'ACTIVE',
        departmentId: defaultDeptId,
        positionId: '',
      });
    }
  }, [employee, departments]);

  // Lọc danh sách chức vụ mỗi khi phòng ban thay đổi
  useEffect(() => {
    if (formData.departmentId) {
      const filtered = allPositions.filter(p => p.departmentId === formData.departmentId);
      setAvailablePositions(filtered);
      
      // Nếu chức vụ hiện tại không thuộc phòng ban mới, reset nó
      if (!filtered.find(p => p.id === formData.positionId)) {
        setFormData(prev => ({ ...prev, positionId: filtered[0]?.id || '' }));
      }
    } else {
      setAvailablePositions([]);
      setFormData(prev => ({ ...prev, positionId: '' }));
    }
  }, [formData.departmentId, allPositions]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.departmentId || !formData.positionId) {
        alert("Vui lòng chọn Phòng ban và Chức vụ.");
        return;
    }
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 dark:bg-boxdark overflow-y-auto max-h-full">
        <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
          {!!employee ? 'Chỉnh sửa Hồ sơ Nhân viên' : 'Thêm Nhân viên mới'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Cột trái */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Họ và Tên</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Mã Nhân viên</label>
                <input type="text" name="employeeCode" value={formData.employeeCode || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Email</label>
                <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
              </div>
            </div>
            {/* Cột phải */}
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Phòng ban</label>
                <select name="departmentId" value={formData.departmentId || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary">
                  <option value="">-- Chọn phòng ban --</option>
                  {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-black dark:text-white">Chức vụ</label>
                <select name="positionId" value={formData.positionId || ''} onChange={handleChange} disabled={!formData.departmentId || availablePositions.length === 0} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary disabled:bg-gray-200 dark:disabled:bg-gray-700">
                  <option value="">-- Chọn chức vụ --</option>
                  {availablePositions.map(pos => <option key={pos.id} value={pos.id}>{pos.name}</option>)}
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-black font-medium hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90">Lưu</button>
          </div>
        </form>
      </div>
    </div>
  );
}