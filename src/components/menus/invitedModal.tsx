import React, {useMemo} from "react";
import styles from './invitedModal.module.css';
import { motion } from 'framer-motion';
import {Button, Placeholder} from "@telegram-apps/telegram-ui";

interface invitedModalInterface {
    setIsModalOpen: (value: boolean) => void;
    sendLink: (userId: any) => void;
    userID: number
    className: any
    t: any
}

const InvitedModal: React.FC<invitedModalInterface> = ({ setIsModalOpen, sendLink, userID, className, t }) => {
    const fadeIn = useMemo(() => ({
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 0.5 } },
    }), []);
    const text = t('InviteMoreText')
    return (
        <motion.div className={styles.modalOverlay}
                    initial="hidden"
                    animate="visible"
                    variants={fadeIn}>
            <div className={styles.modal}>
                <Placeholder description={text} style={{width: '70%', background:'var(--tgui--bg_color)', flexDirection:'column-reverse', borderRadius: '24px'}}>
                    <Button stretched onClick={() => setIsModalOpen(false)} mode={'outline'} style={{color: 'var(--tgui--text_color)'}}>
                        {t('CancelInviteMore' as any)}
                    </Button>
                    <Button stretched onClick={() => sendLink(userID)}>
                        {t('InviteMore' as any)}
                    </Button>
                </Placeholder>
            </div>
        </motion.div>
    )
}

export default InvitedModal