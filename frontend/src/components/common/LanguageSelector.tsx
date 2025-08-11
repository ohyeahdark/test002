import { Menu } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', label: 'English' },
  { code: 'vi', label: 'Tiếng Việt' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
  };

  const currentLang = i18n.language.slice(0, 2).toUpperCase();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <Menu.Button
        className="flex items-center gap-1 justify-center w-auto h-10 px-3 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-white" />
        <span className="text-xs font-medium text-gray-700 dark:text-white">
          {currentLang}
        </span>
      </Menu.Button>

      <Menu.Items
        className="absolute right-0 z-50 mt-2 w-36 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-gray-800"
      >
        {languages.map((lang) => (
          <Menu.Item key={lang.code}>
            {({ active }) => (
              <button
                onClick={() => handleChange(lang.code)}
                className={`${
                  active ? 'bg-gray-100 dark:bg-gray-700' : ''
                } group flex w-full items-center px-4 py-2 text-sm text-gray-700 dark:text-white`}
              >
                {lang.label}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSelector;
