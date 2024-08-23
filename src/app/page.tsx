'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import axios from 'axios';
import styles from './page.module.css';
import { initInitData, initUtils } from '@telegram-apps/sdk';
import { ProgressiveImage } from "@/components/Img";
import { ProgressiveImageCont } from "@/components/ImgCont";
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
            '/button.svg',
            '/purpBtn.svg',
            '/taskBoard.svg',
            '/mail.svg',
            '/coin.svg',
            '/close.svg',
            '/telegram.svg',
            '/tipContainer.svg'
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
                        <p className={styles.balance}>{userData?.balance}</p>
                        <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                    </div>
                    <div className={styles.referalsDescription}>
                        <p className={styles.balance}>Referals: {userData?.referals}</p>
                    </div>
                </div>
                <div>
                    <ProgressiveImage src="/text.svg" alt="text" className={styles.text} />
                </div>
                <button className={styles.openModalBtn} onClick={handleButtonClick} onTouchEnd={handleButtonClick}>
                    <ProgressiveImage src="/button.svg" alt="Button Image" className={styles.ButtonImage} />
                    <span className={styles.buttonText}>GET MORE MODY</span>
                </button>
            {isModalVisible && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modal}>
                        <div className={styles.taskBoardContainer}>
                            <ProgressiveImageCont src="/taskBoard.svg" alt="taskboard" className={styles.taskBoard}>
                                <div className={styles.taskBoardContent}>
                                    <div className={styles.taskBoardTextContainer}>
                                        <span className={styles.taskBoardText}>HOT TASK</span>
                                        <span className={styles.taskBoardText}>WITH REWARD</span>
                                    </div>
                                    <ProgressiveImageCont src="/tipContainer.svg" alt="tip1" className={styles.taskBackground}>
                                        <div className={styles.taskContent}>
                                            <div className={styles.imageAndDescription}>
                                                <ProgressiveImage alt='telegram' src="/telegram.svg" className={styles.taskIcon} />
                                                <div className={styles.taskDescriptionContainer}>
                                                    <span className={styles.taskDescription}>Invite your friends</span>
                                                    <div className={styles.rewardDescription}>
                                                        <span className={styles.taskDescription}>+500</span>
                                                        <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                                                    </div>
                                                </div>
                                            </div>
                                            <button
                                                className={styles.startBtn}
                                                onClick={() => copyLinkToClipboard(userId)}>
                                                <ProgressiveImage src="/purpBtn.svg" alt="Button Image" className={styles.StartButtonImage} />
                                                <span className={styles.startButtonText}>{copyStatus}</span>
                                            </button>
                                        </div>
                                    </ProgressiveImageCont>
                                    <ProgressiveImageCont src="/tipContainer.svg" alt="tip2" className={styles.taskBackground}>
                                        <div className={styles.taskContent}>
                                            <div className={styles.imageAndDescription}>
                                                <ProgressiveImage alt='telegram' src="/telegram.svg" className={styles.taskIcon} />
                                                <div className={styles.taskDescriptionContainer}>
                                                    <span className={styles.taskDescription}>Join Channel</span>
                                                    <div className={styles.rewardDescription}>
                                                        <span className={styles.taskDescription}>+500</span>
                                                        <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className={styles.startBtn} onClick={() => handleStartButtonClick("https://t.me/AndreyDurden")}>
                                                <ProgressiveImage src="/purpBtn.svg" alt="Button Image" className={styles.StartButtonImage} />
                                                <span className={styles.startButtonText}>START</span>
                                            </button>
                                        </div>
                                    </ProgressiveImageCont>
                                    <ProgressiveImageCont src="/tipContainer.svg" alt="tip3" className={styles.taskBackground}>
                                        <div className={styles.taskContent}>
                                            <div className={styles.imageAndDescription}>
                                                <ProgressiveImage alt='telegram' src="/telegram.svg" className={styles.taskIcon} />
                                                <div className={styles.taskDescriptionContainer}>
                                                    <span className={styles.taskDescription}>Join Channel</span>
                                                    <div className={styles.rewardDescription}>
                                                        <span className={styles.taskDescription}>+500</span>
                                                        <ProgressiveImage alt='coin' src="/coin.svg" className={styles.coinImage} />
                                                    </div>
                                                </div>
                                            </div>
                                            <button className={styles.startBtn} onClick={() => handleStartButtonClick("https://t.me/AndreyDurden")}>
                                                <ProgressiveImage src="/purpBtn.svg" alt="Button Image" className={styles.StartButtonImage} />
                                                <span className={styles.startButtonText}>START</span>
                                            </button>
                                        </div>
                                    </ProgressiveImageCont>
                                </div>
                            </ProgressiveImageCont>
                        </div>
                        <button className={styles.closeButtonWrapper} onClick={handleCloseModal}>
                            <ProgressiveImage src="/close.svg" alt="Close" className={styles.closeButton} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
