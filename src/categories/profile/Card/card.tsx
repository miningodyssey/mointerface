import React from 'react';
import styles from './card.module.css';
import {IconCheckboxChecked} from "@telegram-apps/telegram-ui/dist/components/Form/Checkbox/icons/checkbox_checked";
import CheckIcon from "@/components/Icons/CheckIcon/checkIcon";

interface CardProps {
    image: any;
    title: string;
    subtitle: string;
    selected?: boolean;
    selectable?: boolean;
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ image, title, subtitle, selected = false, selectable = false, onClick }) => {
    const handleClick = () => {
        if (selectable && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`${styles.card} ${selected ? styles.selected : ''} ${selectable ? styles.selectable : ''}`}
            onClick={handleClick}
        >

            <div className={styles.cardImageContainer}>
                <span className={styles.cardImage}>{image}</span>
                {selectable && selected && (
                    <span className={styles.icon}>
                    <CheckIcon />
                </span>
                )}
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardSubtitle}>{subtitle}</p>
            </div>
        </div>
    );
};

export default Card;
