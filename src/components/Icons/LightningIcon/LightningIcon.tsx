import React from 'react';
import styles from './LightningIcon.module.css';
import { motion } from 'framer-motion';

export const LightningIcon = () => (
    <motion.svg className={styles.LightningIcon} width="13" height="22" viewBox="0 0 13 22" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M1 12.0323L8.41762 1L6.73463 9.16517H12.2823L4.49064 20.6961L6.17363 12.0323H1Z"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinejoin="round"
        />
    </motion.svg>
);

export default LightningIcon;
