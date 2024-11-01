export function detectPlatform(platform) {
    // Если platform не передан, используем platform от navigator
    if (!platform) {
        platform = navigator.platform.toLowerCase();
    }

    // Убедимся, что platform - это строка
    if (typeof platform !== 'string') {
        console.error('platform is not a string:', platform);
        return 'unknown';
    }

    // Проверяем наличие подстрок в строке platform
    if (platform.includes('win') || platform.includes('mac') || platform.includes('linux') || platform.includes('desktop') || platform.includes('web')) {
        return 'desktop';
    } else if (platform.includes('iphone') || platform.includes('ipad') || platform.includes('android') || platform.includes('ios')) {
        return 'mobile';
    } else {
        return 'unknown';
    }
}
