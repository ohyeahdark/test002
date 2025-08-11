import { Menu } from 'lucide-react';
import ThemeToggleButton from '../common/ThemeToggleButton';
import LanguageSelector from '../common/LanguageSelector';
import UserDropdown from '../header/UserDropdown';
import { useLocation, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const navItems = [
    { path: '/department', labelKey: 'nav.department', icon: '📁' },
    { path: '/position', labelKey: 'nav.position', icon: '📌' },
    { path: '/employee', labelKey: 'nav.employee', icon: '👤' },
];

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
    const { pathname } = useLocation();
    const { t } = useTranslation();
    const segments = pathname.split('/').filter(Boolean);
    const paths = segments.map((_seg, index) => `/${segments.slice(0, index + 1).join('/')}`);

    return (
        <header className="sticky top-0 z-40 flex items-center justify-between border-b bg-white px-4 py-3 shadow-sm dark:border-gray-700 dark:bg-gray-900">
            <button
                onClick={onToggleSidebar}
                className="flex items-center justify-center rounded md:hidden"
                aria-label="Open sidebar"
            >
                <Menu className="w-5 h-5 text-gray-700 dark:text-white" />
            </button>

            <div className="flex flex-wrap items-center gap-1 text-sm font-medium md:text-base">
                <Link to="/" className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white">
                    {t('nav.home')}
                </Link>
                {paths.map((path, idx) => {
                    const item = navItems.find((n) => path.startsWith(n.path));
                    const isLast = idx === paths.length - 1;

                    return (
                        <div key={path} className="flex items-center gap-1">
                            <span className="text-gray-400">/</span>
                            {isLast ? (
                                <span className="text-gray-700 dark:text-white flex items-center gap-1">
                                    {item?.icon && <span>{item.icon}</span>}
                                    <span className="capitalize">
                                        {t(item?.labelKey || `nav.${segments[idx].toLowerCase()}`)}
                                    </span>
                                </span>
                            ) : (
                                <Link
                                    to={path}
                                    className="text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white flex items-center gap-1"
                                >
                                    {item?.icon && <span>{item.icon}</span>}
                                    <span className="capitalize">
                                        {t(item?.labelKey || `nav.${segments[idx].toLowerCase()}`)}
                                    </span>
                                </Link>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggleButton />
                <LanguageSelector />
                <UserDropdown />
            </div>
        </header>
    );
}