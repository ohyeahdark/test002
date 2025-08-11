import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import ThemeToggleButton from './ThemeToggleButton';
import LanguageSelector from './LanguageSelector';

interface SettingDialogProps {
  open: boolean;
  onClose: () => void;
}

const SettingDialog = ({ open, onClose }: SettingDialogProps) => {
  return (
    <Transition appear show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-sm transform overflow-hidden rounded-xl bg-white dark:bg-gray-900 p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                  ⚙️ Cài đặt giao diện
                </Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Giao diện:
                    </label>
                    <ThemeToggleButton />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-300 mb-1">
                      Ngôn ngữ:
                    </label>
                    <LanguageSelector />
                  </div>

                  {/* Mở rộng sau này: Profile, Đăng xuất... */}
                </div>

                <div className="mt-6 text-right">
                  <button
                    onClick={onClose}
                    className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-300 dark:hover:bg-gray-600 text-sm"
                  >
                    Đóng
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SettingDialog;
