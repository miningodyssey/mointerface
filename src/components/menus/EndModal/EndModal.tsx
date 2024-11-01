import React, { forwardRef, Ref, useMemo } from "react";
import styles from './EndModal.module.css';
import { motion } from 'framer-motion';
import { Button, Placeholder } from "@telegram-apps/telegram-ui";

interface EndModalInterface {
    setIsModalOpen: (value: boolean) => void;
    restartButtonRef: Ref<HTMLButtonElement>;   // Пропс для рестарта
    backToMenuRef: Ref<HTMLButtonElement>;       // Пропс для возврата в меню
    t: any;
    className?: string;
}

const EndModal = forwardRef<HTMLDivElement, EndModalInterface>(({
                                                                    setIsModalOpen, restartButtonRef, backToMenuRef, t, className
                                                                }, ref) => {
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }), []);

    const text = t('InviteMoreText');
    EndModal.displayName = 'EndModal';
    return (
        <motion.div
            className={`${styles.modalOverlay} ${className}`}
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            ref={ref}  // Присваиваем основной ref обёртке modalOverlay
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
                        ref={backToMenuRef}   // Привязка к кнопке BackToMenu
                    >
                        {t('BackToMenu')}
                    </Button>
                    <Button
                        stretched
                        ref={restartButtonRef}  // Привязка к кнопке RestartGame
                    >
                        {t('RestartGame')}
                    </Button>
                </Placeholder>
            </div>
        </motion.div>
    );
});

export default EndModal;
