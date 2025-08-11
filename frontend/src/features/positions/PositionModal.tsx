import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Position } from '../../types';

interface PositionModalProps {
  position: Partial<Position> | null;
  onClose: () => void;
  onSave: (data: Partial<Position>) => Promise<void> | void;
}

export const PositionModal = ({ position, onClose, onSave }: PositionModalProps) => {
  const { t } = useTranslation();
  const [name, setName] = useState(position?.name || '');
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!position;

  useEffect(() => {
    setName(position?.name || '');
  }, [position]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      alert(t('position.nameRequired'));
      return;
    }
    if (trimmedName.length > 100) {
      alert(t('position.limitName'));
      return;
    }

    setIsLoading(true);
    try {
      await onSave(
        position?.id ? { id: position.id, name: trimmedName } : { name: trimmedName }
      );
    } catch (error) {
      alert(t('position.saveFailed'));
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="w-full max-w-md p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 text-black dark:text-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEditMode ? t('position.editTitle') : t('position.addTitle')}
        </h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="position-name" className="block text-sm font-medium mb-1">
              {t('position.fields.name')}
            </label>
            <input
              id="position-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
              aria-label={t('position.fields.name')}
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
              className={`px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-500 ${
                isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
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
