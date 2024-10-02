import React from "react";
import styles from "@/app/page.module.css";
import {motion} from "framer-motion";
import {Button, Snackbar} from "@telegram-apps/telegram-ui";

interface MainCategoryProps {
    isImagesLoaded: boolean;
    fadeIn: any;
    setIsLogoLoaded: (value: boolean) => void;
    snackbarOpen: boolean;
    setSnackbarOpen: (value: boolean) => void;
    t: (key: string) => any;
    sendLink: (userId: number) => void;
    userId: number;
}

const MainCategory: React.FC<MainCategoryProps> = ({
                                                       isImagesLoaded,
                                                       fadeIn,
                                                       setIsLogoLoaded,
                                                       snackbarOpen,
                                                       setSnackbarOpen,
                                                       t,
                                                       sendLink,
                                                       userId,
                                                   }) => {
    return (
        <div>
            <div className={styles.textContainer}>
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
                {snackbarOpen && (
                    <Snackbar
                        onClose={() => setSnackbarOpen(false)}
                        duration={3000}
                        before={<span role="img" aria-label="checkmark">✅</span>}
                        description={t('linkCopied')}
                    >
                        {t('done')}
                    </Snackbar>
                )}
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
        </div>
    );
};

export default MainCategory;
