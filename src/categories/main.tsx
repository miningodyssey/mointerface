import React, { useState, useEffect } from "react";
import styles from "./main.module.css";
import { motion } from "framer-motion";
import { Button } from "@telegram-apps/telegram-ui";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";

interface MainCategoryProps {
    isImagesLoaded: boolean;
    fadeIn: any;
    setIsLogoLoaded: (value: boolean) => void;
    t: (key: string) => any;
    sendLink: (userId: number) => void;
    userId: number;
    registrationTime: number; // Добавляем проп для времени регистрации в формате Unix timestamp
}

const MainCategory: React.FC<MainCategoryProps> = ({
                                                       isImagesLoaded,
                                                       fadeIn,
                                                       setIsLogoLoaded,
                                                       t,
                                                       sendLink,
                                                       userId,
                                                       registrationTime, // Используем проп
                                                   }) => {
    const [timeLeft, setTimeLeft] = useState<number>(0);

    const TWO_HOURS = 2 * 60 * 60; // Время в секундах (2 часа)

    useEffect(() => {
        const calculateTimeLeft = () => {
            const currentTime = Math.floor(Date.now() / 1000); // Текущее время в Unix timestamp
            const elapsedTime = currentTime - registrationTime; // Время, прошедшее с момента регистрации

            // Если прошло больше 2 часов, перезапускаем таймер
            if (elapsedTime >= TWO_HOURS) {
                setTimeLeft(TWO_HOURS); // Сбрасываем таймер на 2 часа
            } else {
                setTimeLeft(TWO_HOURS - (elapsedTime % TWO_HOURS)); // Оставшееся время до конца 2-часового периода
            }
        };

        // Начальный расчет времени
        calculateTimeLeft();

        const interval = setInterval(() => {
            calculateTimeLeft();
        }, 1000); // Обновляем каждую секунду

        return () => clearInterval(interval); // Чистим интервал при размонтировании
    }, [registrationTime]);

    const formatTime = (seconds: number) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className={styles.mainContainer}>
            <div>
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
                <div></div>
            </div>
            <div className={styles.startButton}>
                <Button
                    mode="filled"
                    size="l"
                    onClick={() => sendLink(Number(userId))}
                    stretched
                >
                    {t('startRun')}
                </Button>
            </div>
            <div className={styles.EnergyContainer}>
                <div className={styles.EnergyCountContainer}>
                    <p className={styles.EnergyCount}><LightningIcon/>3/10</p>
                    <p className={styles.EnergyCountTimer}>{formatTime(timeLeft)}</p>
                </div>
                <Button mode={'bezeled'}>
                    Watch ads to add energy!
                </Button>
            </div>
            <div className={styles.DailyContainer}>
                <h1 className={styles.DailyTasksH1}>Daily tasks</h1>
            </div>
        </div>
    );
};

export default MainCategory;
