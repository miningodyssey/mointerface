'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { initInitData, initUtils } from '@telegram-apps/sdk';
import { ProgressiveImage } from "@/components/Img";
import { user } from "@/types/user.type";
import { Button, Snackbar, Spinner } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { Loader } from "@/components/Loader";

const preloadImages = (imageUrls: string[]): Promise<void[]> => {
    return Promise.all(
        imageUrls.map(
            (src) =>
                new Promise<void>((resolve, reject) => {
                    const img = new Image();
                    img.src = src;
                    img.onload = () => resolve();
                    img.onerror = reject;
                })
        )
    );
};

async function fetchDataAndInitialize() {
    try {
        const data = initInitData();
        console.log(data?.user?.photoUrl)
        const userId = data?.user?.id || 0;
        const userData = {
            balance: 0,
            referrals: 0,
            referer: data?.startParam,
            upgrades: null,
            personalRecord: 0,
            tgUserdata: data?.user,
            registrationDate: String(Date.now()),
        };
        const authResponse = await axios.post(`https://miningodyssey.pw/auth/register/${userId}`, userData);
        const token = authResponse.data['access_token'];

        const userResponse = await axios.post(
            `https://miningodyssey.pw/users/create/${userId}`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        console.log('User created/updated:', userResponse.data);
        return { userId, token, fetchedUserData: userResponse.data };
    } catch (error) {
        console.error('Error during initialization:', error);
        throw error;
    }
}

export default function Home() {
    const [isLoading, setIsLoading] = useState(true); // Состояние для отображения лоадера
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userId, setUserId] = useState<number>(0);
    const [userData, setUserData] = useState<user>();
    const [taskList, setTaskList] = useState();
    const [authKey, setAuthKey] = useState<string>();
    const [copyStatus, setStatus] = useState('COPY');
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [isInitialized, setIsInitialized] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    const utils = useMemo(() => (typeof window !== 'undefined' ? initUtils() : null), []);
    const initialize = async () => {
        try {
            const { userId, token, fetchedUserData } = await fetchDataAndInitialize();
            setUserId(userId);
            setAuthKey(token);
            setUserData(fetchedUserData);
            setIsInitialized(true);
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    };

    useEffect(() => {
        initialize().finally(() => {
            // Устанавливаем isLoading в false только после завершения инициализации
            setIsLoading(false);
        });

        // Проверяем завершение загрузки страницы
        const handleLoad = () => {
            setIsLoading(false);
        };

        window.addEventListener('load', handleLoad);

        return () => {
            window.removeEventListener('load', handleLoad);
        };
    }, []);

    useEffect(() => {
        const images = [
            '/bg.svg',
            '/text.svg',
            '/comingsoon.svg',
            '/coin.svg',
        ];

        preloadImages(images)
            .then(() => {
                setIsImagesLoaded(true);
            })
            .catch((err) => console.error('Failed to preload images:', err));
    }, []);

    const handleButtonClick = useCallback(async () => {
        try {
            setIsModalVisible(true);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }, [userId, authKey, isInitialized]);


    const copyLinkToClipboard = useCallback((userId: number) => {
        const link = `https://t.me/MiningOdysseyBot/Game?startapp=${userId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                setStatus('DONE');
                handleSnackbarOpen(); // Открыть Snackbar
            })
            .catch(err => console.error('Не удалось скопировать ссылку', err));
    }, []);

    // Если страница загружается, показываем лоадер
    if (!isImagesLoaded || isLoading) {
        return <Spinner  size='l'/>;
    }

    return (
        <div>
            <link rel="preload" href="/bg.svg" as="image"/>
            <link rel="preload" href="/text.svg" as="image"/>
            <link rel="preload" href="/comingsoon.svg" as="image"/>
            <link rel="preload" href="/coin.svg" as="image"/>
            <ProgressiveImage src="/bg.svg" alt="bgimage" className={styles.bgImage} width={'100'} height={'100'}/>
            <div className={styles.userDescription}>
                <div className={styles.balanceDescription}>
                    <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                    <p className={styles.balance}>{userData?.balance || 0}</p>
                </div>
                <div className={styles.referalsDescription}>
                    <p className={styles.balance}>Referals: {userData?.referals || 0}</p>
                </div>
            </div>
            <div className={styles.textContainer}>
                <ProgressiveImage src="/text.svg" alt="text" className={styles.text} width={'100'}/>
                <ProgressiveImage src="/comingsoon.svg" alt="text" className={styles.comingSoonText} width={'50'} />
                <Button
                    mode='filled'
                    size='l'
                    style={{ background: "linear-gradient(90deg, #E5C400 0%, #FE7500 100%)" }}
                    onClick={() => copyLinkToClipboard(Number(userId))}
                    onTouchEnd={() => copyLinkToClipboard(Number(userId))}
                >
                    GET MORE MOODY
                </Button>
                {snackbarOpen && (
                    <Snackbar
                        onClose={() => setSnackbarOpen(false)}
                        duration={3000} // Время отображения в миллисекундах
                        before={<span role="img" aria-label="checkmark">✅</span>}
                        description={'Your referal link has been copied to the clipboard!'}
                    >
                        Done!
                    </Snackbar>
                )}
            </div>
            <div>
            </div>
        </div>
    );
}
