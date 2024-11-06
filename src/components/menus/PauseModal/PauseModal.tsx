import React, {forwardRef, Ref, useMemo} from "react";
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
            <div className={styles.modal}>
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
                    <h2 className={styles.taskHeader}>Tasks</h2>
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
                    {t('ResumeGame')}
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
