import React, { useState } from 'react';
import type { Department } from '../../types';

interface DepartmentModalProps {
    department: Partial<Department> | null;
    onClose: () => void;
    onSave: (data: Partial<Department>) => void;
}

export const DepartmentModal = ({ department, onClose, onSave }: DepartmentModalProps) => {
    const [name, setName] = useState(department?.name || '');
    const isEditMode = !!department;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            alert("Tên phòng ban không được để trống");
            return;
        }
        onSave({ id: department?.id, name });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 dark:bg-boxdark">
                <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                    {isEditMode ? 'Chỉnh sửa Phòng ban' : 'Thêm Phòng ban mới'}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-black dark:text-white">Tên Phòng ban</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent py-2 px-4 font-medium outline-none transition focus:border-primary active:border-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg bg-gray-200 text-black font-medium hover:bg-gray-300">Hủy</button>
                        <button type="submit" className="px-6 py-2 rounded-lg bg-primary text-white font-medium hover:bg-opacity-90">
                            {isEditMode ? 'Lưu' : 'Thêm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};