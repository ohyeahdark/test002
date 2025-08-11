import React, { forwardRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { Department, Employee, Position } from '../../types';
import DatePicker from 'react-datepicker';
import { parseISO } from 'date-fns';

interface EmployeeModalProps {
  employee: Partial<Employee> | null;
  onClose: () => void;
  onSave: (data: Partial<Employee>) => Promise<void> | void;
  departments: Department[];
  positions: Position[];
}

export const EmployeeModal = ({
  employee,
  onClose,
  onSave,
  departments,
  positions,
}: EmployeeModalProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<Partial<Employee>>({});
  const [isLoading, setIsLoading] = useState(false);
  const isEditMode = !!employee;

  useEffect(() => {
    setForm({ ...employee });
  }, [employee]);

  const handleChange = (key: keyof Employee, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.name?.trim()) return alert(t('employee.nameRequired'));

    setIsLoading(true);
    try {
      await onSave(form);
    } catch (err) {
      alert(t('employee.saveFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const CustomInput = forwardRef<HTMLInputElement, React.HTMLProps<HTMLInputElement>>(
    ({ value, onClick }, ref) => (
      <input
        type="text"
        onClick={onClick}
        ref={ref}
        value={value}
        readOnly
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
        placeholder={t('employee.fields.chooseDate')}
      />
    )
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex justify-center items-center">
      <div className="w-full max-w-lg p-6 rounded-lg shadow-xl bg-white dark:bg-gray-800 text-black dark:text-white">
        <h3 className="text-xl font-semibold mb-4">
          {isEditMode ? t('employee.editTitle') : t('employee.addTitle')}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.name')}
            </label>
            <input
              type="text"
              value={form.name || ''}
              onChange={(e) => handleChange('name', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.birthday')}
            </label>
            <DatePicker
              selected={form.dateOfBirth ? parseISO(form.dateOfBirth) : null}
              onChange={(date: Date | null) =>
                handleChange('dateOfBirth', date ? date.toISOString().split('T')[0] : '')
              }
              dateFormat="yyyy-MM-dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              wrapperClassName="w-full"
              customInput={<CustomInput />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.email')}
            </label>
            <input
              type="email"
              value={form.email || ''}
              onChange={(e) => handleChange('email', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.department')}
            </label>
            <select
              value={form.departmentId || ''}
              onChange={(e) => handleChange('departmentId', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none"
            >
              <option value="">{t('employee.fields.chooseDepartment')}</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.position')}
            </label>
            <select
              value={form.positionId || ''}
              onChange={(e) => handleChange('positionId', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none"
            >
              <option value="">{t('employee.fields.choosePosition')}</option>
              {positions.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="w-full">
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.hireDate')}
            </label>
            <DatePicker
              selected={form.hireDate ? parseISO(form.hireDate) : null}
              onChange={(date: Date | null) =>
                handleChange('hireDate', date ? date.toISOString().split('T')[0] : '')
              }
              dateFormat="yyyy-MM-dd"
              showMonthDropdown
              showYearDropdown
              dropdownMode="select"
              wrapperClassName="w-full"
              customInput={<CustomInput />}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.status')}
            </label>
            <select
              value={form.status || ''}
              onChange={(e) => handleChange('status', e.target.value)}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 px-4 text-sm outline-none"
            >
              <option value="ACTIVE">{t('employee.status.active')}</option>
              <option value="INACTIVE">{t('employee.status.inactive')}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              {t('employee.fields.avatar')}
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onloadend = () => {
                  handleChange('avatarUrl', reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
              className="w-full border text-sm"
            />
            {form.avatarUrl && (
              <div className="mt-2">
                <img
                  src={form.avatarUrl}
                  alt="avatar preview"
                  className="w-16 h-16 rounded-full object-cover border"
                />
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
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
              className={`px-6 py-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-black dark:text-white font-medium hover:bg-gray-300 dark:hover:bg-gray-500 ${isLoading ? 'bg-primary/70 cursor-not-allowed' : 'bg-primary hover:bg-opacity-90'
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
