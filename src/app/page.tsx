'use client';

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import {initInitData, initMiniApp} from '@telegram-apps/sdk';
import { ProgressiveImage } from "@/components/Img";
import { user } from "@/types/user.type";
import { Button, Snackbar, Spinner } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { useTranslation } from 'react-i18next';
import './../i18n'
import { motion } from 'framer-motion';


const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1 } },
};
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
    const { t } = useTranslation();
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
    useEffect(() => {
        const data = initMiniApp();
        if (data && window.Telegram && window.Telegram.WebApp) {
            window.Telegram.WebApp.setHeaderColor('var(--tgui--bg_color)');
        }
    }, []);
    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

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
        return (
            <div className={styles.homeBody}>
                <Spinner  size='l'/>
            </div>
        )
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
        >
            <motion.img
                src="/bg.svg"
                alt="bgimage"
                className={styles.bgImage}
                initial="hidden"
                animate="visible"
                variants={fadeIn}
                fetchPriority={'high'}
            />
            <div className={styles.userDescription}>
                <div className={styles.balanceDescription}>
                    <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                    <p className={styles.balance}>{userData?.balance || 0}</p>
                </div>
                <div className={styles.referalsDescription}>
                    <p className={styles.balance}>{t('referals' as any)}: {userData?.referals || 0}</p>
                </div>
            </div>
            <div className={styles.textContainer}>
                <div className={styles.logoContainer}>
                    <motion.img
                        src="/text.svg"
                        alt="text"
                        className={styles.logo}
                        initial="hidden"
                        animate="visible"
                        variants={fadeIn}
                    />
                </div>
                <p className={styles.comingSoonText}>{t('coomingsoon' as any)}</p>
                <Button
                    mode='filled'
                    size='l'
                    style={{ background: "linear-gradient(90deg, #E5C400 0%, #FE7500 100%)" }}
                    onClick={() => copyLinkToClipboard(Number(userId))}
                    onTouchEnd={() => copyLinkToClipboard(Number(userId))}
                >
                    {t('getMoreMoody' as any)}
                </Button>
                {snackbarOpen && (
                    <Snackbar
                        className={styles.snackBar}
                        onClose={() => setSnackbarOpen(false)}
                        duration={3000}
                        before={<span role="img" aria-label="checkmark">✅</span>}
                        description={t('linkCopied' as any)}
                    >
                        {t('done' as any) }
                    </Snackbar>
                )}
            </div>
            <div>
            </div>
        </motion.div>
    );
}
