import React, { forwardRef, Ref, useMemo } from "react";
import styles from './EndModal.module.css';
import { motion } from 'framer-motion';
import { Button, Placeholder } from "@telegram-apps/telegram-ui";
import LightningIcon from "@/components/Icons/LightningIcon/LightningIcon";

interface EndModalInterface {
    setIsModalOpen: (value: boolean) => void;
    restartButtonRef: Ref<HTMLButtonElement>;
    backToMenuRef: Ref<HTMLButtonElement>;
    t: any;
    userData: any;
    className?: string;
    scoreDisplay: any;
}

const EndModal = forwardRef<HTMLDivElement, EndModalInterface>(({
                                                                    setIsModalOpen,
                                                                    restartButtonRef,
                                                                    backToMenuRef,
                                                                    scoreDisplay,
                                                                    t,
                                                                    className,
                                                                    userData
                                                                }, ref) => {
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }), []);

    const energyMoreThanZero = userData.energy > 0;
    const timer = "1:58:11"; // Пример значения, замените на реальное
    let scoreMessage = ''
    // Расчет разницы до личного рекорда
    if (scoreDisplay) {
        const score = parseInt(scoreDisplay.replace("Score: ", ""), 10);
        const personalRecord = userData.personalRecord || 0;
        const scoreDifference = personalRecord - score;
        scoreMessage = scoreDifference > 0
            ? `${scoreDifference} очков до личного рекорда!`
            : "Поздравляем! Вы побили свой рекорд!";

    }
    EndModal.displayName = 'EndModal';

    return (
        <motion.div
            className={`${styles.modalOverlay} ${className}`}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            ref={ref}
        >
            <div className={styles.modal}>
                <h2 className={styles.title}>Continue?</h2>
                <p className={styles.pointsText}>
                    {scoreMessage}
                </p>
                <div className={styles.statusRow}>
                    <LightningIcon className={`${styles.energyIcon} ${!energyMoreThanZero ? styles.redEnergy : ''}`} />
                    <span>{userData.energy}/1</span>
                    <span className={styles.Timer}>{timer}</span>
                </div>

                <Button
                    stretched
                    ref={restartButtonRef}
                    style={{ marginBottom: '10px' }}
                >
                    Keep on running!
                </Button>
                <Button
                    stretched
                    mode="outline"
                    className={styles.quitButton}
                    ref={backToMenuRef}
                >
                    Quit run
                </Button>
            </div>
        </motion.div>
    );
});

export default EndModal;
