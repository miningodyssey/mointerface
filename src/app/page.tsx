'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { initInitData, initUtils } from '@telegram-apps/sdk';
import { ProgressiveImage } from "@/components/Img";
import {Loader} from "@/components/Loader/loader";
import {user} from "@/types/user.type";

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
        const userId = data?.user?.id || 0;
        const userData = {
            balance: 0,
            referrals: 0,
            referer: data?.startParam,
            upgrades: null,
            personalRecord: 0,
            tgUserdata: data?.user,
            registrationDate: new Date(),
        };

        const authResponse = await axios.post(`https://miningodyssey.pw/auth/register/${userId}`);
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

    // Инициализация utils только на клиенте
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
            'comingsoon.svg',
            'getmoremoody.svg',
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


    const handleCloseModal = useCallback(() => {
        setIsModalVisible(false);
        setStatus('COPY');
    }, []);

    const handleStartButtonClick = useCallback(async (link: string) => {
        utils?.openTelegramLink(link);
        console.log('Start button clicked!');

        try {
            const data = {
                reward: 500,
                taskDescription: "Bara",
                imageLink: "Bere",
                taskLink: "https://vk.com"
            };

            const response = await axios.post('https://miningodyssey.pw/tasks', data, {
                headers: {
                    'Authorization': `Bearer ${authKey}`,
                    'Content-Type': 'application/json',
                }
            });

            console.log('Response:', response.data);
        } catch (error) {
            console.error('Error:', error);
        }
    }, [authKey, utils]);

    const copyLinkToClipboard = useCallback((userId: number) => {
        const link = `https://t.me/MiningOdysseyBot/Game?startapp=${userId}`;
        navigator.clipboard.writeText(link)
            .then(() => setStatus('DONE'))
            .catch(err => console.error('Не удалось скопировать ссылку', err));
    }, []);

    // Если страница загружается, показываем лоадер
    if (!isImagesLoaded || isLoading) {
        return <Loader />; // Показываем лоадер, пока изображения загружаются
    }


    return (
        <div>
            <ProgressiveImage src="/bg.svg" alt="bgimage" className={styles.bgImage} />
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
                    <ProgressiveImage src="/text.svg" alt="text" className={styles.text} />
                    <ProgressiveImage src="/comingsoon.svg" alt="text" className={styles.comingSoonText}/>
                    <button className={styles.openModalBtn} onClick={() => copyLinkToClipboard(Number(userId))} onTouchEnd={() => copyLinkToClipboard(Number(userId))}>
                        <div className={styles.ButtonBG} >
                            <ProgressiveImage src="/getmoremoody.svg" alt="text" className={styles.ButtonText} />
                        </div>
                    </button>
                </div>
                <div>

                </div>
        </div>
    );
}
