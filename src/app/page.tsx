'use client';

import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import axios from 'axios';
import styles from './page.module.css';
import {initInitData, initMiniApp, initUtils} from '@telegram-apps/sdk';
import { user } from "@/types/user.type";
import { Button, Snackbar, Spinner } from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import { useTranslation } from 'react-i18next';
import './../i18n'
import { motion } from 'framer-motion';
import CoinIcon from "@/components/CoinIcon/CoinIcon";
import PeopleIcon from "@/components/PeopleIcon/PeopleIcon";
import CopyIcon from "@/components/CopyIcon/CopyIcon";


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

        return { userId, token, fetchedUserData: userResponse.data };
    } catch (error) {
        console.error('Error during initialization:', error);
        throw error;
    }
}

export default function Home() {
    const { t } = useTranslation();
    const [userData, setUserData] = useState<user>();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<number>(0);
    const [authKey, setAuthKey] = useState<string>();
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [isLogoLoaded, setIsLogoLoaded] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }), []);
    useEffect(() => {
        // Инициализация Telegram Web App
        const initTelegramWebApp = () => {
            const data = initMiniApp();
            if (data && window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.disableVerticalSwipes = true;
                window.Telegram.WebApp.setHeaderColor('var(--tgui--bg_color)');
            }
            if (window.TelegramWebviewProxy) {
                window.TelegramWebviewProxy.postEvent('web_app_setup_swipe_behavior', { allow_vertical_swipe: false });
            }
        };

        // Отключаем вертикальный скролл для мобильных устройств
        const disableTouchScroll = (e: TouchEvent) => {
            e.preventDefault();
        };

        // Добавляем слушатель на касания
        document.body.addEventListener('touchmove', disableTouchScroll, { passive: false });

        if (typeof window !== 'undefined') {
            initTelegramWebApp();
        }

        // Удаляем слушатель при размонтировании
        return () => {
            document.body.removeEventListener('touchmove', disableTouchScroll);
        };
    }, []);


    const utils = useMemo(() => (typeof window !== 'undefined' ? initUtils() : null), []);
    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    const initialize = async () => {
        try {
            const { userId, token, fetchedUserData } = await fetchDataAndInitialize();
            setUserId(userId);
            setAuthKey(token);
            setUserData(fetchedUserData);
        } catch (error) {
            console.error('Error during initialization:', error);
        }
    };

    useEffect(() => {
        initialize().finally(() => {
            setIsLoading(false);
        });

        const handleLoad = () => setIsLoading(false);
        window.addEventListener('load', handleLoad);

        return () => window.removeEventListener('load', handleLoad);
    }, []);

    useEffect(() => {
        const images = ['/bg.svg', '/text.svg'];

        const preload = async () => {
            try {
                await preloadImages(images);
                setIsImagesLoaded(true);
            } catch (error) {
                console.error('Failed to preload images:', error);
            }
        };

        preload();
    }, []);



    const copyLinkToClipboard = useCallback((userId: number) => {
        const link = `https://t.me/MiningOdysseyBot/Game?startapp=${userId}`;
        navigator.clipboard.writeText(link)
            .then(() => {
                handleSnackbarOpen();
            })
            .catch(err => console.error('Не удалось скопировать ссылку', err));
    }, []);

    const sendLink = useCallback((userId: number) => {
        const link = `https://t.me/MiningOdysseyBot/Game?startapp=${userId}`;
        if (utils) {
            utils.shareURL(t('InviteMessage'),link)
        }
    }, []);
    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !audioRef.current.muted;
            setIsMuted(audioRef.current.muted);
        }
    };
    // Если страница загружается, показываем лоадер
    if (!isImagesLoaded || isLoading || !userData) {
        return (
            <div>
                <Spinner  size='l'/>
            </div>
        )
    }

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.pageBody}
        >
            <audio ref={audioRef} autoPlay loop muted={isMuted}>
                <source src="/bgsound.mp3" type="audio/mpeg" />
            </audio>


            <motion.img
                src="/bg.svg"
                alt="bg"
                className={styles.bgImage}
                initial="hidden"
                animate={isImagesLoaded ? "visible" : "hidden"}
                variants={fadeIn}
            />
            <div className={styles.userDescription}>
                <div className={styles.balanceContainer}>
                    <p className={styles.totalbalance}>{t('totalBalance' as any)}</p>
                    <div className={styles.balanceDescription}>
                        <CoinIcon />
                        <p className={styles.balance}>{userData?.balance || 0}</p>
                    </div>
                </div>
                <div className={styles.referalsDescription}>
                    <PeopleIcon/>
                    <p className={styles.referals}> {userData?.referals || 0} {t('referals' as any)} </p>
                </div>
                <button onClick={toggleMute} className={styles.muteBtn}>
                    {isMuted ? '🔇' : '🔊'}
                </button>
            </div>
            <div className={styles.textContainer}>
                <div className={styles.logoContainer}>
                    <motion.img
                        src="/text.svg"
                        alt="text"
                        className={styles.logo}
                        initial="hidden"
                        animate={isImagesLoaded ? "visible" : "hidden"}
                        variants={fadeIn}
                        onLoad={() => setIsLogoLoaded(true)}
                    />
                </div>
                <div>

                </div>
                {snackbarOpen && (
                    <Snackbar
                        onClose={() => setSnackbarOpen(false)}
                        duration={3000}
                        before={<span role="img" aria-label="checkmark">✅</span>}
                        description={t('linkCopied' as any)}
                    >
                        {t('done' as any) }
                    </Snackbar>
                )}
            </div>
            <div className={styles.inviteButton}>
                <Button
                    mode='filled'
                    size='l'
                    onClick={() => sendLink(Number(userId))}
                    stretched
                >
                    {t('inviteFriends' as any)}
                </Button>
                <button
                    className={styles.copyButton}
                    onClick={() => copyLinkToClipboard(Number(userId))}
                >
                    <CopyIcon />
                </button>
            </div>
        </motion.div>
    );
}