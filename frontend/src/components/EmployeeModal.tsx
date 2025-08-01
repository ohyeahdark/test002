import React, { useState, useEffect } from 'react';
import { type Employee } from '../types';

interface EmployeeModalProps {
  employee: Partial<Employee> | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => void;
  departments: string[];
  positions: Record<string, string[]>;
}

export function EmployeeModal({ employee, onClose, onSave, departments, positions }: EmployeeModalProps) {
  const [formData, setFormData] = useState(
    employee || {
      employeeCode: '', name: '', email: '', phone: '',
      department: departments[0], position: positions[departments[0]][0],
    }
  );
  const isEditMode = !!employee;

  useEffect(() => { if (employee) setFormData(employee); }, [employee]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };
    if (name === 'department') {
      newFormData.position = positions[value]?.[0] || ''; // Cập nhật an toàn
    }
    setFormData(newFormData);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  // Lấy danh sách chức vụ một cách an toàn
  const currentPositions = positions[formData.department || ''] || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-surface rounded-lg shadow-xl w-full max-w-lg p-6">
        <h3 className="text-xl font-semibold text-heading mb-4">
          {isEditMode ? 'Chỉnh sửa thông tin Nhân viên' : 'Thêm Nhân viên mới'}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Mã Nhân viên</label>
              <input type="text" name="employeeCode" value={formData.employeeCode || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Họ và Tên</label>
              <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-secondary">Email</label>
              <input type="email" name="email" value={formData.email || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Số điện thoại</label>
              <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-secondary">Phòng ban</label>
              <select name="department" value={formData.department || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary">
                {departments.map(dep => <option key={dep} value={dep}>{dep}</option>)}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-medium text-secondary">Chức vụ</label>
              <select name="position" value={formData.position || ''} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-gray-300 bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary">
                {/* SỬA LỖI Ở ĐÂY */}
                {currentPositions.map(pos => <option key={pos} value={pos}>{pos}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-gray-800 font-medium hover:bg-gray-300">Hủy</button>
            <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:opacity-90">
              {isEditMode ? 'Lưu thay đổi' : 'Thêm mới'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}