'use client';

import React, {useState, useEffect, useCallback, useMemo, useRef} from 'react';
import styles from './home.module.css';
import {initMiniApp, initUtils} from '@telegram-apps/sdk';
import {user} from "@/types/user.type";
import {Snackbar, Spinner, Tabbar} from '@telegram-apps/telegram-ui';
import '@telegram-apps/telegram-ui/dist/styles.css';
import {useTranslation} from 'react-i18next';
import './../../i18n';
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
import TasksCategory from "@/categories/tasks/tasks";
import InvitedModal from "@/components/menus/InvitedModal/invitedModal";
import ProfileCategory from "@/categories/profile/profile";
import ForwardIcon from "@/components/Icons/ForwardIcon/forwardIcon";
import {TonConnectButton, useTonAddress, useTonConnectUI} from '@tonconnect/ui-react';
import {fetchTopPlayers} from "@/components/functions/fetchTopPlayers";
import {fetchReferals} from "@/components/functions/fetchReferals";
import {fetchFriends} from "@/components/functions/fetchFriends";
import GameComponent from "@/game/components/GameComponent";


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

type TopPlayersType = {
    userPosition: number
    topTen: any[];
};

export default function HomeComponent() {
    const {t} = useTranslation();
    const [userData, setUserData] = useState<any>();
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<number>(0);
    const [authKey, setAuthKey] = useState<string>();
    const [isImagesLoaded, setIsImagesLoaded] = useState(false);
    const [isLogoLoaded, setIsLogoLoaded] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [currentTab, setCurrentTab] = useState(tabs[0].id);
    const [topPlayers, setTopPlayers] = useState<TopPlayersType | null>(null);
    const [referals, setReferals] = useState([]);
    const [friends, setFriends] = useState([]);
    const [gameButtonClicked, setGameButtonClicked] = useState(false);
    const [tonConnectUI, setOptions] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress();
    const audioRef = useRef<HTMLAudioElement>(null);
    const fadeIn = useMemo(() => ({
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {duration: 0.5}},
    }), []);


    useEffect(() => {
        const initTelegramWebApp = () => {
            const data = initMiniApp();
            if (data && window.Telegram && window.Telegram.WebApp) {
                window.Telegram.WebApp.disableVerticalSwipes();
                window.Telegram.WebApp.isVerticalSwipesEnabled = false;
                window.Telegram.WebApp.expand()
            }
            if (window.TelegramWebviewProxy) {
                window.TelegramWebviewProxy.postEvent('web_app_setup_swipe_behavior', {allow_vertical_swipe: false});
            }
        };
        initTelegramWebApp()
    }, [window.Telegram]);

    const utils = useMemo(() => (typeof window !== 'undefined' ? initUtils() : null), []);
    const handleSnackbarOpen = () => {
        setSnackbarOpen(true);
    };

    useEffect(() => {
        const initialize = async () => {
            try {
                const { userId, token, fetchedUserData } = await fetchDataAndInitialize();
                setUserData(fetchedUserData);
                setUserId(userId);
                setAuthKey(token);
                // Загрузите топ игроков и друзей позже
                const [top, refTop, friends] = await Promise.all([
                    fetchTopPlayers(userId, token),
                    fetchReferals(userId, token),
                    fetchFriends(userId, token),
                ]);
                setTopPlayers(top);
                setFriends(friends);
                setReferals(refTop);
            } catch (error) {
                console.error('Error during initialization:', error);
            } finally {
                setIsLoading(false);
            }
        };

        initialize();
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
        setIsModalOpen(true);
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
    if (!isImagesLoaded || isLoading || !userData || !window.Telegram || !topPlayers || !referals) {
        return (
            <div>
                <Spinner className={styles.Spinner} size='m'/>
            </div>
        )
    }
    return gameButtonClicked ? (
        <GameComponent t={t} setGameButtonClicked={setGameButtonClicked} userData={userData} setUserData={setUserData}/>
    ) : (
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
                        <div className={styles.topBarBtn} onClick={() => sendLink(userId)}>
                            <ForwardIcon/>
                            <p>Share</p>
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
                            {
                                !userFriendlyAddress && (
                                    <div className={styles.topBarBtn}  onClick={() => tonConnectUI.openModal()}>
                                        <WalletIcon/>
                                        <p>Wallet</p>
                                    </div>
                                )
                            }
                            {
                                userFriendlyAddress && (
                                    <div>
                                        <TonConnectButton />
                                    </div>
                                )
                            }
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
                        registrationTime={Number(userData?.registrationDate)}
                        utils={utils}
                        userData={userData}
                        token={authKey}
                        setGameButtonClicked={setGameButtonClicked}
                        setUserData={setUserData}
                    />
                )}
                {currentTab === 1 && topPlayers && (
                    <LeaderBoardCategory
                        fadeIn={fadeIn}
                        copyLinkToClipboard={copyLinkToClipboard}
                        sendLink={sendLink}
                        t={t}
                        userId={userId}
                        topPlayers={topPlayers}
                        friends={friends}
                    />
                )}
                {currentTab === 2 && (
                    <TasksCategory
                        fadeIn={fadeIn}
                        utils={utils}
                        t={t}
                        userid={userId}
                        setUserData={setUserData}
                        userData={userData}
                    />
                )}
                {currentTab === 3 && (
                    <FriendsCategory
                        fadeIn={fadeIn}
                        copyLinkToClipboard={copyLinkToClipboard}
                        sendLink={sendLink}
                        t={t}
                        userId={userId}
                        referals={referals}

                    />
                )}
                {currentTab === 4 && (
                    <ProfileCategory
                        fadeIn={fadeIn}
                        userData={userData}
                        setUserData={setUserData}
                        token={authKey}
                    />
                )}

            </div>
            {snackbarOpen && (
                <Snackbar
                    onClose={() => setSnackbarOpen(false)}
                    duration={3000}
                    before={<span role="img" aria-label="checkmark">✅</span>}
                    description={t('linkCopied' as any)}
                >
                    {t('done' as any)}
                </Snackbar>
            )}
            {isModalOpen && (
                <InvitedModal t={t} setIsModalOpen={setIsModalOpen} sendLink={sendLink} userID={userId}
                              className={styles.InvitedModal}/>
            )}
            <Tabbar style={{
                background: 'var(--tgui--bg_color)',
                zIndex: '1000',
                display: 'flex',
                flexShrink: '0',
                position: 'fixed',
                bottom: '0',
                left: '0',

            }}>

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