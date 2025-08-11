import { useTranslation } from 'react-i18next';

export default function NotAuthorized() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen flex items-center justify-center text-center bg-white border-gray-200 z-99999 dark:border-gray-800 dark:bg-gray-900 lg:border-b">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-black dark:text-white">🚫 {t('common.notAuthorized')}</h1>
        <p className="text-gray-700 dark:text-gray-300">{t('common.notAuthorizedMessage')}</p>
      </div>
    </div>
  );
}
