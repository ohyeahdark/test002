// src/pages/employees/EmployeeModal.tsx
import React, { forwardRef, useEffect, useState } from 'react';
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from '@headlessui/react';
import { X, Loader2, ChevronDown } from 'lucide-react';
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
  const isEditMode = !!employee?.id;
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setForm({ ...employee });
    setError(null);
  }, [employee]);

  const handleChange = (key: keyof Employee, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const name = form.name?.trim();
    if (!name) {
      setError(t('employee.nameRequired'));
      return;
    }
    setError(null);

    setIsLoading(true);
    try {
      await onSave({ ...form, name });
      onClose();
    } catch (err) {
      console.error(err);
      setError(t('employee.saveFailed'));
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
  CustomInput.displayName = 'CustomInput';

  return (
    <Transition show as={React.Fragment}>
      <Dialog
        as="div"
        className="relative z-50"
        onClose={() => (!isLoading ? onClose() : undefined)}
      >
        {/* Overlay */}
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
            {/* Panel */}
            <TransitionChild
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-2 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-2 sm:scale-95"
            >
              <DialogPanel className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl ring-1 ring-black/5">
                {/* Header */}
                <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
                  <DialogTitle className="text-base font-semibold">
                    {isEditMode ? t('employee.editTitle') : t('employee.addTitle')}
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

                {/* Body */}
                <form onSubmit={handleSubmit} className="px-4 py-3 space-y-4">
                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300">
                      {error}
                    </div>
                  )}

                  {/* Tên */}
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

                  {/* Ngày sinh */}
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

                  {/* Email */}
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

                  {/* Phòng ban */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('employee.fields.department')}
                    </label>
                    <div className="relative">
                      <select
                        value={form.departmentId || ''}
                        onChange={(e) => handleChange('departmentId', e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-4 pr-9 text-sm outline-none"
                      >
                        <option value="">{t('employee.fields.chooseDepartment')}</option>
                        {departments.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Chức vụ */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('employee.fields.position')}
                    </label>
                    <div className="relative">
                      <select
                        value={form.positionId || ''}
                        onChange={(e) => handleChange('positionId', e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-4 pr-9 text-sm outline-none"
                      >
                        <option value="">{t('employee.fields.choosePosition')}</option>
                        {positions.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Ngày vào làm */}
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

                  {/* Trạng thái */}
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t('employee.fields.status')}
                    </label>
                    <div className="relative">
                      <select
                        value={form.status || 'ACTIVE'}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full appearance-none rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 py-2 pl-4 pr-9 text-sm outline-none"
                      >
                        <option value="ACTIVE">{t('employee.status.active')}</option>
                        <option value="INACTIVE">{t('employee.status.inactive')}</option>
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                  </div>

                  {/* Ảnh đại diện */}
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
                      className="w-full border text-sm rounded-lg py-2 px-3 dark:border-gray-600"
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

                  {/* Footer */}
                  <div className="flex items-center justify-end gap-2 border-t pt-3 dark:border-gray-700">
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
