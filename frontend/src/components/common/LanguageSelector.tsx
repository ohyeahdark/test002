import { Menu } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Check, Globe } from 'lucide-react';
import React from 'react';

const languages = [
  { code: 'en', label: 'English', country: 'us' },
  { code: 'vi', label: 'Tiếng Việt', country: 'vn' },
];

const flagSrc = (country: string) => `/images/country/${country}.svg`;

function Flag({ country, alt }: { country: string; alt?: string }) {
  const [error, setError] = React.useState(false);
  if (error) {
    return <Globe className="w-4 h-4 text-gray-600 dark:text-white" aria-label={alt} />;
  }
  return (
    <img
      src={flagSrc(country)}
      alt={alt}
      className="h-4 w-6 rounded-sm border object-cover"
      onError={() => setError(true)}
      loading="eager"
      decoding="async"
    />
  );
}

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const code2 = (i18n.language || 'en').split('-')[0]; // 'en-US' -> 'en'
  const current = languages.find((l) => l.code === code2) || languages[0];

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
        <Flag country={current.country} alt={current.label} />
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
                <Flag country={lang.country} alt={lang.label} />
                <span>{lang.label}</span>
                {current.code === lang.code && <Check className="ml-auto h-4 w-4" />}
              </button>
            )}
          </Menu.Item>
        ))}
      </Menu.Items>
    </Menu>
  );
};

export default LanguageSelector;
