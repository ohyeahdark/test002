import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../../types';

interface DepartmentModalProps {
    department: Partial<Department> | null;
    onClose: () => void;
    onSave: (data: Partial<Department>) => Promise<void> | void;
}

export const DepartmentModal = ({ department, onClose, onSave }: DepartmentModalProps) => {
    const { t } = useTranslation();
    const [name, setName] = useState(department?.name || '');
    const [isLoading, setIsLoading] = useState(false);
    const isEditMode = !!department;

    useEffect(() => {
        setName(department?.name || '');
    }, [department]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedName = name.trim();
        if (!trimmedName) {
            alert(t('department.nameRequired'));
            return;
        }
        if (trimmedName.length > 100) {
            alert(t('department.limitName'));
            return;
        }

        setIsLoading(true);
        try {
            await onSave(
                department?.id ? { id: department.id, name: trimmedName } : { name: trimmedName }
            );
        } catch (error) {
            alert(t('department.saveFailed'));
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
            <div className="w-full max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 text-black dark:text-white">
                <h3 className="text-xl font-semibold mb-4">
                    {isEditMode ? t('department.editTitle') : t('department.addTitle')}
                </h3>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label
                            htmlFor="department-name"
                            className="mb-2 block text-sm font-medium"
                        >
                            {t('department.fields.name')}
                        </label>
                        <input
                            id="department-name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={100}
                            autoFocus
                            aria-label={t('department.fields.name')}
                            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-500"
                            disabled={isLoading}
                        >
                            {t('common.cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 font-medium ${isLoading
                                    ? 'bg-primary/70 cursor-not-allowed'
                                    : 'bg-primary hover:bg-opacity-90'
                                }`}
                        >
                            {isLoading
                                ? t('common.inSave')
                                : isEditMode
                                    ? t('common.save')
                                    : t('common.add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
