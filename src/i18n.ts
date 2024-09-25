// src/i18n.ts
import { createI18n } from 'vue-i18n';
import en from './locales/en.json';
import vi from './locales/vi.json';

const savedLanguage = localStorage.getItem('language') || 'en';


// Cấu hình i18n
const i18n = createI18n({
  locale: savedLanguage, // Ngôn ngữ mặc định
  fallbackLocale: 'vi', // Ngôn ngữ dự phòng
  messages: {
    en,
    vi
  },
});

export default i18n;
