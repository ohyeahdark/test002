import React, { useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { Department } from '../../types';

interface DepartmentModalProps {
  department: Partial<Department> | null;
  onClose: () => void;
  onSave: (data: Partial<Department>) => Promise<void> | void;
}

export const DepartmentModal: React.FC<DepartmentModalProps> = ({ department, onClose, onSave }) => {
  const { t } = useTranslation();
  const [name, setName] = useState<string>(department?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isEditMode = !!department?.id;

  useEffect(() => {
    setName(department?.name || '');
    setError(null);
  }, [department]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError(t('department.nameRequired'));
      return;
    }
    if (trimmedName.length > 100) {
      setError(t('department.limitName'));
      return;
    }

    setIsLoading(true);
    try {
      await onSave(isEditMode ? { id: department!.id, name: trimmedName } : { name: trimmedName });
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('department.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => (!isLoading ? onClose() : undefined)}>
        <TransitionChild
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/30" />
        </TransitionChild>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-2 sm:scale-95"
            >
              <DialogPanel className="w-full max-w-md overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
                  <DialogTitle className="text-base font-semibold">
                    {isEditMode ? t('department.editTitle') : t('department.addTitle')}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    disabled={isLoading}
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    aria-label={t('common.close')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-4 py-3">
                  {error && (
                    <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  <div>
                    <label htmlFor="department-name" className="mb-2 block text-sm font-medium">
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
                    <div className="mt-1 text-xs text-gray-400 dark:text-gray-500">{name.length}/100</div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-2 border-t pt-3 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700"
                      disabled={isLoading}
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 disabled:opacity-60"
                    >
                      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />} 
                      {isEditMode ? t('common.save') : t('common.add')}
                    </button>
                  </div>
                </form>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};
