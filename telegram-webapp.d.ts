interface WebApp {
    setHeaderColor(color: string): void;
    disableVerticalSwipes: boolean;
    expand();
}

interface Telegram {
    WebApp: WebApp;
}

interface Window {
    Telegram?: Telegram;
    TelegramWebviewProxy?
}
