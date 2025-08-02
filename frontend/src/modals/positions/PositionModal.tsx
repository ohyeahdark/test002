import React, { useState } from 'react';
import type { Position, Department } from '../../types';

interface PositionModalProps {
    position: Partial<Position> | null;
    departments: Department[];
    onClose: () => void;
    onSave: (data: Partial<Position>) => void;
}

export const PositionModal = ({ position, departments, onClose, onSave }: PositionModalProps) => {
    const [formData, setFormData] = useState({
        name: position?.name || '',
        departmentId: position?.departmentId || (departments[0]?.id || '')
    });
    const isEditMode = !!position;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({...prev, [name]: value}));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.departmentId) {
            alert("Vui lòng điền đầy đủ thông tin.");
            return;
        }
        onSave({ id: position?.id, ...formData });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-boxdark">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                    {isEditMode ? 'Chỉnh sửa Chức vụ' : 'Thêm Chức vụ mới'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Tên Chức vụ</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary" />
                        </div>
                        <div>
                            <label className="mb-2 block text-sm font-medium text-black dark:text-white">Thuộc Phòng ban</label>
                            <select name="departmentId" value={formData.departmentId} onChange={handleChange} className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary">
                                {departments.map(dep => <option key={dep.id} value={dep.id}>{dep.name}</option>)}
                            </select>
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
};