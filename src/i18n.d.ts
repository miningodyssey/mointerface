import 'i18next';

declare module 'i18next' {
    interface Resources {
        en: {
            translation: {
                welcome: string;
                getMoreMoody: string;
                referals: string;
                done: string;
                linkCopied: string;
                simpleContent: string; // добавьте все ключи, которые используете
            }
        };
        ru: {
            translation: {
                welcome: string;
                getMoreMoody: string;
                referals: string;
                done: string;
                linkCopied: string;
                simpleContent: string; // добавьте все ключи, которые используете
            }
        }
    }
}
