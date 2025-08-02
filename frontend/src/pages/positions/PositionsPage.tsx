import { useState, useEffect, useCallback } from 'react';
import { api } from '../../api';
import type { Position, Department } from '../../types';
import PageBreadCrumb from '../../components/common/PageBreadCrumb';
import { PositionModal } from '../../modals/positions/PositionModal';

const PositionsPage = () => {
    const [positions, setPositions] = useState<Position[]>([]);
    const [departments, setDepartments] = useState<Department[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPosition, setEditingPosition] = useState<Position | null>(null);

    const loadData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [positionsRes, departmentsRes] = await Promise.all([
                api.get('/positions'),
                api.get('/departments')
            ]);
            setPositions(positionsRes.data);
            setDepartments(departmentsRes.data);
        } catch (err) { console.error(err); } 
        finally { setIsLoading(false); }
    }, []);

    useEffect(() => { loadData(); }, [loadData]);

    const handleSave = async (data: Partial<Position>) => {
        try {
            if (editingPosition) {
                await api.patch(`/positions/${data.id}`, data);
            } else {
                await api.post('/positions', data);
            }
            loadData();
            closeModal();
        } catch (err) { alert('Đã xảy ra lỗi khi lưu.'); }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Bạn có chắc chắn muốn xóa chức vụ này?')) {
            try {
                await api.delete(`/positions/${id}`);
                loadData();
            } catch (err) { alert('Đã xảy ra lỗi khi xóa.'); }
        }
    };

    const openModalForEdit = (pos: Position) => {
        setEditingPosition(pos); setIsModalOpen(true);
    };
    const openModalForAdd = () => {
        setEditingPosition(null); setIsModalOpen(true);
    };
    const closeModal = () => {
        setIsModalOpen(false); setEditingPosition(null);
    };

    return (
        <>
            <PageBreadCrumb pageTitle="Quản lý Chức vụ" />
            <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
                <div className="mb-4 flex justify-end">
                    <button onClick={openModalForAdd} className="px-5 py-2 rounded-md bg-primary text-white font-medium hover:bg-opacity-90 flex items-center gap-2">
                        <i className="fas fa-plus"></i> Thêm Chức vụ
                    </button>
                </div>
                <div className="max-w-full overflow-x-auto">
                    <table className="w-full table-auto">
                        <thead>
                            <tr className="bg-gray-2 text-left dark:bg-meta-4">
                                <th className="px-4 py-4 font-medium text-black dark:text-white xl:pl-11">Tên Chức vụ</th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white">Phòng ban</th>
                                <th className="px-4 py-4 font-medium text-black dark:text-white">Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading ? (
                                <tr><td colSpan={3} className="text-center p-8">Đang tải...</td></tr>
                            ) : positions.map((pos) => (
                                <tr key={pos.id}>
                                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                                        <h5 className="font-medium text-black dark:text-white">{pos.name}</h5>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <p className="text-black dark:text-white">{pos.department?.name}</p>
                                    </td>
                                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                                        <div className="flex items-center space-x-3.5">
                                            <button onClick={() => openModalForEdit(pos)} className="hover:text-primary"><i className="fas fa-pencil-alt"></i></button>
                                            <button onClick={() => handleDelete(pos.id)} className="hover:text-primary"><i className="fas fa-trash-alt"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {isModalOpen && <PositionModal position={editingPosition} departments={departments} onClose={closeModal} onSave={handleSave} />}
        </>
    );
};

export default PositionsPage;