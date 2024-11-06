import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';

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
                    "CancelInviteMore": "⏳ Later",
                    "Profile": "Profile",
                    "Leaderboard": "Leaderboard",
                    "Tasks": "Tasks",
                    "Home": "Home",
                    "Friends": "Friends",
                    "WatchAd": "Watch ads to add energy!",
                    "Settings": "Settings",
                    "Wallet": "Wallet",
                    "Share": "Share",
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
                    "InviteMore": "🔄 Пригласить еще",
                    "CancelInviteMore": "⏳ Позже",
                    "Profile": "Профиль",
                    "Leaderboard": "Рейтинг",
                    "Tasks": "Задачи",
                    "Home": "Дом",
                    "Friends": "Друзья",
                    "WatchAd": "Смотри рекламу, получай энергию!",
                    "Settings": "Настройки",
                    "Wallet": "Кошелек",
                    "Share": "Поделиться",
                    "Daily tasks": "Задачи дня",
                    "Become the best runner!": "Стань лучшим бегуном!",
                    "See where you stand and challenge top runners": "Узнай свой результат и соревнуйся с лидерами",
                    "racers": "игроков",
                    "Total points": "Всего очков",
                    "Global": "Общий",
                    "Task": "Задача",
                    "completed": "выполнена",
                    "Complete tasks and earn points!": "Выполняй задачи и зарабатывай очки!",
                    "Check for daily tasks updates": "Проверь обновления задач на день",
                    "Active": "Активные",
                    "All": "Все",
                    "Success!": "Успех!",
                    "Close": "Закрыть",
                    "Get 5,000 points for every friend invited": "Получай 5 000 очков за каждого приглашённого друга",
                    "Earn 10% of your friend's points": "Зарабатывай 10% от очков друга",
                    "You have earned ": "Вы получили ",
                    " from your friends": " от ваших друзей",
                    "friends invited": "друзей приглашено",
                    "Failed to update nickname.": "Не удалось обновить никнейм.",
                    "An error occurred while updating the nickname.": "Произошла ошибка при обновлении никнейма.",
                    "Skins": "Скины",
                    "Levels": "Уровни",
                    "Power-ups": "Усиления",
                    "Default skin": "Стандартный скин",
                    "Enter your nickname": "Введите свой ник",
                    "Current skin": "Текущий скин",
                    "Do you want to purchase this card?": "Вы хотите купить эту карту?",
                    "This action cannot be undone.": "Это действие нельзя отменить.",
                    "Confirm Purchase": "Купить",
                    "Insufficient funds": "Недостаточно средств",
                    "You do not have enough points to purchase this card.": "У вас недостаточно очков для покупки этой карты.",
                    "Purchased": "Куплено"



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