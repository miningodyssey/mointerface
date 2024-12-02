interface WebApp {
    setHeaderColor(color: string): void;
    disableVerticalSwipes(): void;
    requestFullscreen(): void;
    enableVerticalSwipes: boolean;
    isVerticalSwipesEnabled: boolean;
    expand(): void;
}

interface Telegram {
    WebApp: WebApp;
}

interface Window {
    Telegram?: Telegram;
    TelegramWebviewProxy?
}
