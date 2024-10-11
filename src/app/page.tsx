'use client';

import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import styles from './page.module.css';
import {initMiniApp, initUtils} from '@telegram-apps/sdk';
import {user} from "@/types/user.type";
import {Button, Snackbar, Spinner, Tabbar} from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import {useTranslation} from 'react-i18next';
import './../i18n'
import {motion} from 'framer-motion';
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import HomeIcon from "@/components/Icons/HomeIcon/HomeIcon";
import UserIcon from "@/components/Icons/HumanIcon/UserIcon";
import ChartIcon from "@/components/Icons/ChartIcon/ChartIcon";
import TasksIcon from "@/components/Icons/TasksIcon/TasksIcon";
import {FriendsIcon} from "@/components/Icons/FriendsIcon/FriendsIcon";
import {fetchDataAndInitialize} from "@/components/functions/fetchDataAndInitialize";
import {preloadImages} from "@/components/functions/preloadImages";
import MainCategory from "@/categories/main/main";
import SettingsIcon from "@/components/Icons/SettingsIcon/SettingsIcon";
import WalletIcon from "@/components/Icons/WalletIcon/WalletIcon";
import LeaderBoardCategory from "@/categories/leaderboard/leaderboard";
import FriendsCategory from "@/categories/friends/friends";


const tabs = [
    {
        id: 0,
        text: "Home",
        Icon: <HomeIcon/>
    },
    {
        id: 1,
        text: "Leaderboard",
        Icon: <ChartIcon/>
    },
    {
        id: 2,
        text: "Tasks",
        Icon: <TasksIcon/>
    },
    {
        id: 3,
        text: "Friends",
        Icon: <FriendsIcon/>
    },
    {
        id: 4,
        text: "Profile",
        Icon: <UserIcon/>
    },
]
export default function Home() {
    const {t} = useTranslation();
    const [userData, setUserData] = useState<user>();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<number>(0);
    const [authKey, setAuthKey] = useState<string>();
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [isLogoLoaded, setIsLogoLoaded] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTab, setCurrentTab] = useState(tabs[0].id);
    const audioRef = useRef<HTMLAudioElement>(null);
    const fadeIn = useMemo(() => ({
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {duration: 0.5}},
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
                window.TelegramWebviewProxy.postEvent('web_app_setup_swipe_behavior', {allow_vertical_swipe: false});
            }
        };

    }, [window.Telegram]);

    const utils = useMemo(() => (typeof window !== 'undefined' ? initUtils() : null), []);
    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    const initialize = async () => {
        try {
            const {userId, token, fetchedUserData} = await fetchDataAndInitialize();
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
            utils.shareURL(t('InviteMessage'), link)
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
                <Spinner size='l'/>
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
            <motion.img
                src="/bg.svg"
                alt="bg"
                className={styles.bgImage}
                initial="hidden"
                animate={isImagesLoaded ? "visible" : "hidden"}
                variants={fadeIn}
            />
            <div className={styles.topBarContainer}>
                {currentTab === 0 &&
                    (<div className={styles.leftButtons}>
                        <div className={styles.topBarBtn}>
                            <SettingsIcon/>
                            <p>Settings</p>
                        </div>
                    </div>)
                }
                {
                    (currentTab === 1 || currentTab === 2) &&
                    (<div className={styles.leftButtons} style={{opacity: '0'}}>
                        <div className={styles.topBarBtn}>
                            <SettingsIcon/>
                            <p>Settings</p>
                        </div>
                    </div>)
                }
                {
                    (currentTab === 4) &&
                    (<div className={styles.leftButtons}>
                        <div className={styles.topBarBtn}>
                            <SettingsIcon/>
                            <p>Settings</p>
                        </div>
                    </div>)
                }
                {
                    currentTab !== 3 && (
                        <div className={styles.userDescription}>
                            <div className={styles.balanceContainer}>
                                <p className={styles.totalbalance}>{t('totalBalance' as any)}</p>
                                <div className={styles.balanceDescription}>
                                    <CoinIcon/>
                                    <p className={styles.balance}>{userData?.balance || 0}</p>
                                </div>
                            </div>
                        </div>
                    )
                }
                {
                    (currentTab === 4 || currentTab === 2 || currentTab === 0) && (
                        <div className={styles.rightButtons}>
                            <div className={styles.topBarBtn}>
                                <WalletIcon/>
                                <p>Wallet</p>
                            </div>
                        </div>
                    )
                }
                {
                    currentTab === 1 &&
                    (<div className={styles.rightButtons} style={{opacity: '0'}}>
                        <div className={styles.topBarBtn}>
                            <WalletIcon/>
                            <p>Wallet</p>
                        </div>
                    </div>)
                }
            </div>

            <div className={styles.mainContent}>
                {currentTab === 0 && (
                    <MainCategory
                        isImagesLoaded={isImagesLoaded}
                        fadeIn={fadeIn}
                        setIsLogoLoaded={setIsLogoLoaded}
                        t={t}
                        sendLink={sendLink}
                        userId={userId}
                        registrationTime={Number(userData?.registrationDate)}
                    />
                )}
                {currentTab === 1 && (
                    <LeaderBoardCategory
                        fadeIn={fadeIn}
                    />
                )}
                {currentTab === 3 && (
                    <FriendsCategory
                        fadeIn={fadeIn}
                    />
                )}
            </div>
            <Tabbar style={{background: 'var(--tgui--bg_color)', flexShrink: '0', height: '70px', position:'relative'}}>
                {tabs.map(({
                               id,
                               text,
                               Icon
                           }) => <Tabbar.Item key={id} text={text} selected={id === currentTab}
                                              onClick={() => setCurrentTab(id)}>
                    {Icon}
                </Tabbar.Item>)}
            </Tabbar>
        </motion.div>
    );
}