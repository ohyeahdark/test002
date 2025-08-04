import 'i18next';
    import type common from './locales/vi/translation.json'; // adjust path as needed

    declare module 'i18next' {
      interface CustomTypeOptions {
        defaultNS: 'translation'; // your default namespace
        resources: {
          translation: typeof common;
        };
      }
    }