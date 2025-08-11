import React from 'react';
import { twMerge } from 'tailwind-merge';
import { useTranslation } from 'react-i18next';

interface DataCardListProps<T> {
  data: T[];
  fields: {
    label: string;
    key: keyof T;
    render?: (item: T) => React.ReactNode;
  }[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  loading?: boolean;
  emptyMessage?: string;
  className?: string;
}

export function DataCardList<T>({
  data,
  fields,
  onEdit,
  onDelete,
  loading = false,
  emptyMessage,
  className,
}: DataCardListProps<T>) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="p-4 text-center text-gray-500">
        {t('table.loading')}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        {emptyMessage || t('table.noData')}
      </div>
    );
  }

  return (
    <div className={twMerge('space-y-4 sm:hidden', className)}>
      {data.map((item, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 dark:border-white/[0.05] bg-white dark:bg-white/[0.03] p-4 shadow-sm"
        >
          <div className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
            {fields.map((field, i) => (
              <div key={i} className="flex justify-between gap-3">
                <span className="font-medium">{field.label}:</span>
                <span className="text-right">
                  {field.render ? field.render(item) : String(item[field.key] ?? '')}
                </span>
              </div>
            ))}
          </div>

          {(onEdit || onDelete) && (
            <div className="flex justify-end gap-2 mt-4">
              {onEdit && (
                <button
                  onClick={() => onEdit(item)}
                  className="text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  {t('common.edit')}
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(item)}
                  className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:opacity-90"
                >
                  {t('common.delete')}
                </button>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
