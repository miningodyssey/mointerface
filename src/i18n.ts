import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const getLanguage = () => {
    if (typeof window !== 'undefined') {
        return navigator.language || 'en';
    }
    return 'en'; // Значение по умолчанию для серверного рендеринга
};


i18n
    .use(initReactI18next)
    .init({
        resources: {
            en: {
                translation: {
                    "welcome": "Welcome to React and react-i18next",
                    "getMoreMoody": "GET MORE MOODY",
                    "referals": "Referals",
                    "done": "Done!",
                    "linkCopied": "Your referral link has been copied to the clipboard!",
                    "coomingsoon": "GAME IS COOMING SOON!"
                }
            },
            ru: {
                translation: {
                    "welcome": "Добро пожаловать в React и react-i18next",
                    "getMoreMoody": "ПОЛУЧИТЬ БОЛЬШЕ MOODY",
                    "referals": "Рефералы",
                    "done": "Готово!",
                    "linkCopied": "Ваша реферальная ссылка скопирована в буфер обмена!",
                    "coomingsoon": "ИГРА СКОРО!"
                }
            }
        },
        lng: getLanguage(), // выбираем язык пользователя или по умолчанию 'en'
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false, // React уже экранирует значения
        },
    });

export default i18n