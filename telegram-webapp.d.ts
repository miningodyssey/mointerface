interface WebApp {
    setHeaderColor(color: string): void;
    disableVerticalSwipes: boolean
}

interface Telegram {
    WebApp: WebApp;
}

interface Window {
    Telegram?: Telegram;
    TelegramWebviewProxy?
}
