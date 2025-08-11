import { useTranslation } from 'react-i18next';

export const getPageTitleFromPath = (path: string): string => {
  const { t } = useTranslation();

  const map: Record<string, string> = {
    '/employee': t('employee.title'),
    '/departmen': t('department.title'),
    '/position': t('position.title'),
    // thêm đường dẫn khác nếu cần
  };

  return map[path] || t('nav.title');
};
