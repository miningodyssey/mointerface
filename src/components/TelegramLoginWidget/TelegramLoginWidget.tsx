import React, { useEffect } from 'react';

interface TelegramLoginWidgetProps {
    telegramUser: any; // Данные о пользователе
    setTelegramUser: React.Dispatch<React.SetStateAction<any>>; // Функция для обновления данных пользователя
}

const TelegramLoginWidget: React.FC<TelegramLoginWidgetProps> = ({ telegramUser, setTelegramUser }) => {

    useEffect(() => {
        // Определяем функцию авторизации
        window.onTelegramAuth = (user: any) => {
            setTelegramUser(user); // Обновляем состояние с данными пользователя
        };

        // Добавляем виджет Telegram
        const script = document.createElement('script');
        script.src = 'https://telegram.org/js/telegram-widget.js?22';
        script.async = true;
        script.setAttribute('data-telegram-login', 'BBBotForTestbot'); // Замените на имя вашего бота
        script.setAttribute('data-size', 'large');
        script.setAttribute('data-radius', '20');
        script.setAttribute('data-onauth', 'onTelegramAuth(user)');
        document.getElementById('telegram-widget')?.appendChild(script);

        // Удаляем функцию из объекта window при размонтировании компонента
        return () => {
            delete window.onTelegramAuth;
        };
    }, [setTelegramUser]);

    return (
        <div>
            <div id="telegram-widget"></div>
        </div>
    );
};

export default TelegramLoginWidget;
