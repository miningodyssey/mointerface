import React from 'react';
import styles from './card.module.css';
import CheckIcon from "@/components/Icons/CheckIcon/checkIcon";
import UsdIcon from "@/components/Icons/UsdIcon/UsdIcon";
import {useTranslation} from "react-i18next";

interface CardProps {
    image: any;
    title: string;
    subtitle: string;
    selected?: boolean;
    selectable?: boolean;
    purchased?: boolean; // Новый проп
    onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ image, title, subtitle, selected = false, selectable = false, purchased = false, onClick }) => {
    const {t} = useTranslation();

    const handleClick = () => {
        if (selectable && onClick) {
            onClick();
        }
    };
    const purchasedLocalization = t("Purchased" as any)
    return (
        <div
            className={`${styles.card} ${selected ? styles.selected : ''} ${selectable ? styles.selectable : styles.notselectable}`}
            onClick={handleClick}
        >
            <div className={styles.cardImageContainer}>
                <span className={styles.cardImage}>{image}</span>

                {selectable && (
                    <span className={styles.icon}>
                        {purchased && !selected ? (
                            <UsdIcon />
                        ) : selected ? (
                            <CheckIcon />
                        ) : null}
                    </span>
                )}
            </div>
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p
                    className={`${styles.cardSubtitle} ${!purchased && !selected && selectable ? styles.greenSubtitle : ''}`}
                >
                    {purchased ? purchasedLocalization : subtitle}
                </p>
            </div>
        </div>
    );
};

export default Card;
