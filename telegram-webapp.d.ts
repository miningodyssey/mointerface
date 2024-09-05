interface WebApp {
    setHeaderColor(color: string): void;
}

interface Telegram {
    WebApp: WebApp;
}

interface Window {
    Telegram?: Telegram;
}
