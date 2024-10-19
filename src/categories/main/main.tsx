import React, {useState, useEffect, useRef} from "react";
import styles from "./main.module.css";
import {motion} from "framer-motion";
import {Button, Cell, Section} from "@telegram-apps/telegram-ui";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import {addEnergyRequest} from "@/components/functions/addEnergyRequest";


interface MainCategoryProps {
    isImagesLoaded: boolean;
    fadeIn: any;
    setIsLogoLoaded: (value: boolean) => void;
    t: (key: string) => any;
    registrationTime: number;
    utils: any;// Добавляем проп для времени регистрации в формате Unix timestamp
    userData: any;
    token: any;
}

const MainCategory: React.FC<MainCategoryProps> = ({
                                                       isImagesLoaded,
                                                       fadeIn,
                                                       setIsLogoLoaded,
                                                       t,
                                                       registrationTime, // Используем проп
                                                       utils,
                                                       userData,
                                                       token
                                                   }) => {
    const FOUR_HOURS_IN_MS = 4 * 60 * 60 * 1000; // 4 часа в миллисПочему она у него екундах

    const [timeLeft, setTimeLeft] = useState(userData.remainingTime);
    const dailyTasksListRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime: number) => {
                if (prevTime > 1000) {
                    return prevTime - 1000; // Уменьшаем оставшееся время каждую секунду
                } else {
                    if (userData.energy < 10) {
                        addEnergyRequest(userData.id, token).then((data: any) => {
                            userData.energy = data.energy
                        });
                    } // передаем userId и token
                    return FOUR_HOURS_IN_MS;
                }
            });
        }, 1000);

        // Очищаем таймер при размонтировании компонента
        return () => clearInterval(timer);
    }, []);

    // Преобразуем миллисекунды в часы, минуты и секунды
    const formatTime = (timeInMs: any) => {
        const hours = Math.floor(timeInMs / (1000 * 60 * 60));
        const minutes = Math.floor((timeInMs % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeInMs % (1000 * 60)) / 1000);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };


    useEffect(() => {
        const dailyTasksList = dailyTasksListRef.current;
        let isDragging = false;
        let startX: number;
        let scrollLeft: number;
        if (dailyTasksList) {
            const onMouseDown = (event: MouseEvent) => {
                isDragging = true;
                dailyTasksList.classList.add('dragging');
                startX = event.pageX; // Получаем координату X мыши
                scrollLeft = dailyTasksList.scrollLeft; // Запоминаем текущую позицию прокрутки
            };

            const onMouseLeave = () => {
                isDragging = false;
                dailyTasksList.classList.remove('dragging');
            };

            const onMouseUp = () => {
                isDragging = false;
                dailyTasksList.classList.remove('dragging');
            };

            const onMouseMove = (event: MouseEvent) => {
                if (!isDragging) return;
                event.preventDefault();
                const x = event.pageX;
                const walk = (x - startX) * 1.7;
                dailyTasksList.scrollLeft = scrollLeft - walk;
            };

            dailyTasksList.addEventListener('mousedown', onMouseDown);
            dailyTasksList.addEventListener('mouseleave', onMouseLeave);
            dailyTasksList.addEventListener('mouseup', onMouseUp);
            dailyTasksList.addEventListener('mousemove', onMouseMove);

            // Убираем обработчики событий при размонтировании компонента
            return () => {
                dailyTasksList.removeEventListener('mousedown', onMouseDown);
                dailyTasksList.removeEventListener('mouseleave', onMouseLeave);
                dailyTasksList.removeEventListener('mouseup', onMouseUp);
                dailyTasksList.removeEventListener('mousemove', onMouseMove);
            };
        } else {
            console.error('Element .DailyTasksList not found');
        }
    }, []);


    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.mainContainer}>
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
            </div>
            <div className={styles.startButton}>
                <Button
                    mode="filled"
                    size="l"
                    stretched
                    onClick={() => utils.openLink('https://subwaygame.vercel.app', {tryBrowser: 'chrome'})}
                >
                    {t('startRun')}
                </Button>
            </div>
            <div className={styles.EnergyContainer}>
                <div className={styles.EnergyCountContainer}>
                    <p className={styles.EnergyCount}><LightningIcon/>{userData.energy}/10</p>
                    <p className={styles.EnergyCountTimer}>{formatTime(timeLeft)}</p>
                </div>
                <Button mode={'bezeled'} disabled>
                    Watch ads to add energy!
                </Button>
            </div>
            <div className={styles.DailyContainer}>
                <h1 className={styles.DailyTasksH1}>Daily tasks</h1>
                <div className={styles.DailyTasksList} ref={dailyTasksListRef}>
                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <CoinIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>
                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <LightningIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>

                    <Cell
                        className={styles.Cell}
                        before={
                            <div>
                                <CoinIcon/>
                            </div>
                        }
                        subtitle={<div style={{color: 'green'}}>5,000 pts</div>}
                    >
                        <div className={styles.DailyTaskName}>
                            <p>Invite friend</p>
                            <p>2/10</p>
                        </div>
                    </Cell>

                </div>
            </div>
        </motion.div>
    );
};

export default MainCategory;
