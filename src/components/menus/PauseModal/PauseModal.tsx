import React, { forwardRef, Ref, useMemo } from "react";
import styles from './PauseModal.module.css';
import { motion } from 'framer-motion';
import { Button, Placeholder } from "@telegram-apps/telegram-ui";

interface PauseModalInterface {
    setIsPaused: (value: boolean) => void;
    resumeButtonRef: Ref<HTMLButtonElement>;  // Пропс для продолжения игры
    backToMenuRef: Ref<HTMLButtonElement>;     // Пропс для возврата в меню
    t: any;
    className?: string;
}

const PauseModal = forwardRef<HTMLDivElement, PauseModalInterface>(({
                                                                        setIsPaused, resumeButtonRef, backToMenuRef, t, className
                                                                    }, ref) => {
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }), []);

    const text = t('PauseText');
    PauseModal.displayName = 'PauseModal';

    return (
        <motion.div
            className={`${styles.modalOverlay} ${className}`}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            ref={ref}
        >
            <div className={styles.modal}>
                <Placeholder
                    description={text}
                    style={{
                        width: '70%',
                        background: 'var(--tgui--bg_color)',
                        flexDirection: 'column-reverse',
                        borderRadius: '24px'
                    }}
                >
                    <Button
                        stretched
                        mode="outline"
                        style={{ color: 'var(--tgui--text_color)' }}
                        ref={backToMenuRef}
                    >
                        {t('BackToMenu')}
                    </Button>
                    <Button
                        stretched
                        ref={resumeButtonRef}
                        onClick={() => setIsPaused(false)}  // Закрыть модальное окно при нажатии
                    >
                        {t('ResumeGame')}
                    </Button>
                </Placeholder>
            </div>
        </motion.div>
    );
});

export default PauseModal;
