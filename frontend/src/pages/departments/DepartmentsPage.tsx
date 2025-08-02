import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api';
import type { Department } from '../../types';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import { DepartmentModal } from '../../modals/departments/DepartmentModal';

const DepartmentsPage = () => {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingDepartment, setEditingDepartment] = useState<Department | null>(null);

    const loadDepartments = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await api.get('/departments');
            setDepartments(response.data);
        } catch (err) { console.error(err); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { loadDepartments(); }, [loadDepartments]);

    const handleSave = async (data: Partial<Department>) => {
        try {
            if (editingDepartment) {
                await api.patch(`/departments/${data.id}`, data);
            } else {
                await api.post('/departments', data);
            }
            loadDepartments();
            closeModal();
        } catch (err) { alert('Đã xảy ra lỗi khi lưu.'); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa phòng ban này?')) {
            try {
                await api.delete(`/departments/${id}`);
                loadDepartments();
            } catch (err) { alert('Đã xảy ra lỗi khi xóa.'); }
        }
    };

    const openModalForEdit = (dept: Department) => {
        setEditingDepartment(dept); setIsModalOpen(true);
    };
    const openModalForAdd = () => {
        setEditingDepartment(null); setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false); setEditingDepartment(null);
    };

    return (
        <>
            <PageBreadCrumb pageTitle="Quản lý Phòng ban" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-4 flex justify-end">
                    <button onClick={openModalForAdd} className="px-5 py-2 rounded-md bg-primary text-white font-medium hover:bg-opacity-90 flex items-center gap-2">
                        <i className="fas fa-plus"></i> Thêm Phòng ban
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Tên Phòng ban</th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={2} className="text-center p-8">Đang tải...</td></tr>
                            ) : departments.map((dept) => (
                                <tr key={dept.id}>
                                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">{dept.name}</h5>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() => openModalForEdit(dept)} className="hover:text-primary"><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => handleDelete(dept.id)} className="hover:text-primary"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <DepartmentModal department={editingDepartment} onClose={closeModal} onSave={handleSave} />}
        </>
    );
};

export default DepartmentsPage;