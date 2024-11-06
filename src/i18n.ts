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
                    "totalBalance": "Total Balance",
                    "inviteFriends": "Invite your friends!",
                    "referals": "friends invited",
                    "done": "Done!",
                    "linkCopied": "Your referral link has been copied to the clipboard!",
                    "startRun": "Start your run!",
                    "coomingsoon": "GAME IS COOMING SOON!",
                    "InviteMessage": "\nHi there! 🚀\n" +
                        "\n" +
                        "Jump into the world of cryptocurrencies with Mining Odyssey and earn rewards! 💰 Sign up using my link and get exclusive bonuses \n" +
                        "\n" +
                        "See you in the game! 😉",
                    "InviteMoreText": "Link sent! Don\'t relax — we\'re waiting for your friends to join so you can get your rewards. Spread the word! 💬",
                    "InviteMore": "🔄 Invite more",
                    "CancelInviteMore" : "⏳ Later"
                }
            },
            ru: {
                translation: {
                    "welcome": "Добро пожаловать в React и react-i18next",
                    "totalBalance": "Баланс",
                    "inviteFriends": "Пригласить друзей",
                    "referals": "друзей приглашено",
                    "done": "Готово!",
                    "startRun": "Начать забег!",
                    "linkCopied": "Ваша реферальная ссылка скопирована в буфер обмена!",
                    "coomingsoon": "ИГРА СКОРО!",
                    "InviteMessage": "\nПривет! 🚀\n" +
                        "\n" +
                        "Врывайся в мир криптовалют с Mining Odyssey и зарабатывай награды! 💰 Регистрируйся по моей ссылке и получай бонусы \n" +
                        "\n" +
                        "До встречи в игре! 😉\n",
                    "InviteMoreText": "🚀 Ссылка отправлена! Не расслабляйся — ждем, когда друзья зайдут, чтобы ты получил бонусы. Расскажи всем! 💬",
                    "InviteMore" : "🔄 Пригласить еще",
                    "CancelInviteMore" : "⏳ Позже"
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