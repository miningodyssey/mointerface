import React, {forwardRef, Ref, useEffect, useMemo, useRef} from "react";
import styles from './PauseModal.module.css';
import {motion} from 'framer-motion';
import {Button, Placeholder} from "@telegram-apps/telegram-ui";
import Task from "@/categories/tasks/task/task";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";

interface PauseModalInterface {
    setIsPaused: (value: boolean) => void;
    resumeButtonRef: Ref<HTMLButtonElement>;
    backToMenuRef: Ref<HTMLButtonElement>;
    scoreDisplay: any;
    t: any;
    className?: string;
}

const PauseModal = forwardRef<HTMLDivElement, PauseModalInterface>(({
                                                                        setIsPaused,
                                                                        resumeButtonRef,
                                                                        backToMenuRef,
                                                                        scoreDisplay,
                                                                        t,
                                                                        className
                                                                    }, ref) => {
    const fadeIn = useMemo(() => ({
        hidden: {opacity: 0},
        visible: {opacity: 1, transition: {duration: 0.5}},
    }), []);
    const modalOverlayRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const modalOverlay = modalOverlayRef.current;
        let isDragging = false;
        let startY: number;
        let scrollTop: number;

        if (modalOverlay) {
            const onMouseDown = (event: MouseEvent) => {
                isDragging = true;
                modalOverlay.classList.add('dragging');
                startY = event.pageY; // Получаем координату Y мыши
                scrollTop = modalOverlay.scrollTop; // Запоминаем текущую позицию прокрутки по вертикали
            };

            const onMouseLeave = () => {
                isDragging = false;
                modalOverlay.classList.remove('dragging');
            };

            const onMouseUp = () => {
                isDragging = false;
                modalOverlay.classList.remove('dragging');
            };

            const onMouseMove = (event: MouseEvent) => {
                if (!isDragging) return;
                event.preventDefault();
                const y = event.pageY;
                const walk = (y - startY) * 1.7; // Определяем дистанцию для прокрутки
                modalOverlay.scrollTop = scrollTop - walk; // Прокручиваем по вертикали
            };

            modalOverlay.addEventListener('mousedown', onMouseDown);
            modalOverlay.addEventListener('mouseleave', onMouseLeave);
            modalOverlay.addEventListener('mouseup', onMouseUp);
            modalOverlay.addEventListener('mousemove', onMouseMove);

            // Убираем обработчики событий при размонтировании компонента
            return () => {
                modalOverlay.removeEventListener('mousedown', onMouseDown);
                modalOverlay.removeEventListener('mouseleave', onMouseLeave);
                modalOverlay.removeEventListener('mouseup', onMouseUp);
                modalOverlay.removeEventListener('mousemove', onMouseMove);
            };
        } else {
            console.error('Element .modalOverlay not found');
        }
    }, []);
    let score = 0;
    if (scoreDisplay) {
        score = parseInt(scoreDisplay.replace("Score: ", ""), 10);
    }
    return (
        <motion.div
            className={`${styles.modalOverlay} ${className}`}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            ref={ref}
        >
            <div className={styles.modal} ref={modalOverlayRef}>
                <div className={styles.header}>
                    <span>{t('Pause')}</span>
                </div>
                <div className={styles.score}>
                    <span>{t('Current score')}</span>
                    <h2><CoinIcon/>{score}</h2>
                </div>
                <Button
                    mode="bezeled"
                >
                    {t('Watch ads and earn 1,000pts')}
                </Button>
                <div className={styles.tasks}>
                    <h2 className={styles.taskHeader}>{t("Tasks")}</h2>
                    <Task
                        key={0}
                        before={
                            (<LightningIcon/>)
                        }
                        after={
                            <div>
                                <p className={styles.TaskReward}>5000 PTS</p>
                            </div>
                        }
                        subtitle={
                            <div style={{color: "var(--tgui--hint_color)"}}>
                                Bebebe
                            </div>
                        }
                        title="Bububub"
                        onClick={() => {
                            console.log('123')
                        }}
                        color={"var(--tgui--secondary_bg_color)"}
                    >
                    </Task>
                    <Task
                        key={1}
                        before={
                            (<LightningIcon/>)
                        }
                        after={
                            <div>
                                <p className={styles.TaskReward}>5000 PTS</p>
                            </div>
                        }
                        subtitle={
                            <div style={{color: "var(--tgui--hint_color)"}}>
                                Bebebe
                            </div>
                        }
                        title="Bububub"
                        onClick={() => {
                            console.log('123')
                        }}
                        color={"var(--tgui--secondary_bg_color)"}

                    >
                    </Task>
                    <Task
                        key={2}
                        before={
                            (<LightningIcon/>)
                        }
                        after={
                            <div>
                                <p className={styles.TaskReward}>5000 PTS</p>
                            </div>
                        }
                        subtitle={
                            <div style={{color: "var(--tgui--hint_color)"}}>
                                Bebebe
                            </div>
                        }
                        title="Bububub"
                        onClick={() => {
                            console.log('123')
                        }}
                        color={"var(--tgui--secondary_bg_color)"}
                    >
                    </Task>
                </div>
                <Button
                    stretched
                    ref={resumeButtonRef}
                    onClick={() => setIsPaused(false)}
                    className={styles.resumeButton}
                >
                    {t('Resume Game')}
                </Button>
                <Button
                    stretched
                    mode="outline"
                    ref={backToMenuRef}
                    className={styles.quitButton}
                >
                    {t('Quit run')}
                </Button>
            </div>
        </motion.div>
    );
});

PauseModal.displayName = 'PauseModal';
export default PauseModal;
