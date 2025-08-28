import React, { forwardRef } from "react";
import { Dialog, DialogPanel, DialogTitle, Transition, TransitionChild } from "@headlessui/react";
import { X, Loader2, FileText, ChevronDown } from "lucide-react";
import { vi } from 'date-fns/locale';
import { createLeave, updateLeave, type LeaveRequest } from "./leaveAPI";
import { useLeaveTypes } from "./LeaveTypes";
import DatePicker from "react-datepicker";
import { useTranslation } from 'react-i18next';

export type LeaveModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved?: (created: LeaveRequest) => void;
  initial?: Partial<LeaveRequest>;
};

export default function LeaveModal({ open, onClose, onSaved, initial }: LeaveModalProps) {
  const { t } = useTranslation();
  const isEdit = Boolean(initial?.id);
  const { types, loading: loadingTypes, error: typeErr } = useLeaveTypes(open);

  // form state
  const [typeId, setTypeId] = React.useState(initial?.typeId ?? "");
  const [startDate, setStartDate] = React.useState<Date | null>(
    initial?.startDate ? new Date(initial.startDate) : null
  );
  const [endDate, setEndDate] = React.useState<Date | null>(
    initial?.endDate ? new Date(initial.endDate) : null
  );
  const [reason, setReason] = React.useState<string>(initial?.reason ?? "");

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (open) {
      setTypeId(initial?.typeId ?? "");
      setStartDate(initial?.startDate ? new Date(initial.startDate) : null);
      setEndDate(initial?.endDate ? new Date(initial.endDate) : null);
      setReason(initial?.reason ?? "");
      setError(null);
    }
  }, [open, initial]);

  const valid = typeId && startDate && endDate && startDate <= endDate;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!valid) { setError(t('leave.error')); return; }
    setSubmitting(true);
    try {
      const payload = {
        typeId,
        startDate: startDate!.toISOString(),
        endDate: endDate!.toISOString(),
        reason,
      };
      const res = isEdit && initial?.id
        ? await updateLeave(initial.id, payload)
        : await createLeave(payload);
      onSaved?.(res);
      onClose();
    } catch (err: any) {
      setError(err?.response?.data?.message || String(err));
    } finally {
      setSubmitting(false);
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
        className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white py-2 px-4 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-gray-400 dark:placeholder:text-gray-400"
        placeholder={t('leave.fields.chooseDate')}
      />
    )
  );
  CustomInput.displayName = 'LeaveModalDateInput';

  return (
    <Transition show={open} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => (!submitting ? onClose() : undefined)}>
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
              <DialogPanel className="w-full max-w-lg overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-black dark:text-white shadow-xl ring-1 ring-black/5">
                <div className="flex items-center justify-between border-b px-4 py-3 dark:border-gray-700">
                  <DialogTitle className="text-base font-semibold">
                    {isEdit ? t('leave.editTitle') : t('leave.addTitle')}
                  </DialogTitle>
                  <button
                    onClick={onClose}
                    disabled={submitting}
                    className="rounded p-1 text-gray-500 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
                    aria-label={t('common.close')}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="px-4 py-3 space-y-3">
                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-300">
                      {error}
                    </div>
                  )}
                  {typeErr && (
                    <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-300">
                      {typeErr}
                    </div>
                  )}

                  <div>
                    <label className="mb-1 block text-sm font-medium">{t('leave.fields.type')}</label>
                    <div className="relative">
                      <select
                        value={typeId}
                        onChange={(e) => setTypeId(e.target.value)}
                        className="w-full appearance-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white p-2 pr-8 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                        required
                        disabled={loadingTypes || types.length === 0}
                      >
                        <option value="" disabled>
                          {loadingTypes ? t('common.loading') : t('common.chooseType')}
                        </option>
                        {types.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.name}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-300" />
                    </div>
                    {!loadingTypes && types.length === 0 && (
                      <div className="mt-1 text-xs text-amber-600 dark:text-amber-300">
                        {t('leave.noType')}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">{t('leave.fields.startDate')}</label>
                      <div className="relative">
                        <DatePicker
                          selected={startDate}
                          onChange={(d) => setStartDate(d)}
                          showTimeSelect
                          timeIntervals={60}
                          timeFormat="HH:mm"
                          dateFormat="yyyy-MM-dd HH:mm"
                          calendarClassName="leave-dp"
                          popperClassName="leave-dp-popper"
                          popperPlacement="bottom-start"
                          showPopperArrow={false}
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium">{t('leave.fields.endDate')}</label>
                      <div className="relative">
                        <DatePicker
                          selected={endDate}
                          onChange={(d) => setEndDate(d)}
                          showTimeSelect
                          timeIntervals={60}
                          timeFormat="HH:mm"
                          dateFormat="yyyy-MM-dd HH:mm"
                          calendarClassName="leave-dp"
                          popperClassName="leave-dp-popper"
                          popperPlacement="bottom-start"
                          showPopperArrow={false}
                          customInput={<CustomInput />}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">{t('leave.fields.reason')}</label>
                    <div className="relative">
                      <FileText className="pointer-events-none absolute left-2 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-300" />
                      <textarea
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        rows={10}
                        className="w-full resize-none rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-black dark:text-white py-2 pl-8 pr-2 text-sm outline-none placeholder:text-gray-400 dark:placeholder:text-gray-400 focus:border-primary focus:ring-1 focus:ring-primary"
                        placeholder={t('leave.fields.reasonHolder')}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 border-t pt-3 dark:border-gray-700">
                    <button
                      type="button"
                      onClick={onClose}
                      disabled={submitting}
                      className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50"
                    >
                      {t('common.cancel')}
                    </button>
                    <button
                      type="submit"
                      disabled={!valid || submitting}
                      className="inline-flex items-center gap-2 rounded-md bg-black px-3 py-2 text-sm text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting && <Loader2 className="h-4 w-4 animate-spin" />} {isEdit ? t('common.edit') : t('common.save')}
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
}
