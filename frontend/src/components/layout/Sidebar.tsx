import { X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
  { path: '/', labelKey: 'nav.department', icon: '📁' },
  { path: '/position', labelKey: 'nav.position', icon: '📌' },
  { path: '/employee', labelKey: 'nav.employee', icon: '👤' },
];

export default function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { pathname } = useLocation();
  const { t } = useTranslation();

  return (
    <div
      className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-white p-4 shadow-md transition-transform duration-300 dark:bg-gray-900 md:relative md:translate-x-0 md:shadow-none ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between mb-6 md:hidden">
        <span className="text-lg font-semibold">{t('nav.menu')}</span>
        <button onClick={onClose}>
          <X className="h-5 w-5 text-gray-700 dark:text-white" />
        </button>
      </div>

      <nav className="space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-2 rounded px-3 py-2 text-sm font-medium transition hover:bg-gray-100 dark:hover:bg-gray-800 ${
              pathname.startsWith(item.path) ? 'bg-gray-100 dark:bg-gray-800' : ''
            }`}
            onClick={onClose}
          >
            <span>{item.icon}</span>
            <span>{t(item.labelKey)}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}