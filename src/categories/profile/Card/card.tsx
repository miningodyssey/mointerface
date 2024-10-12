import React from 'react';
import styles from './card.module.css'

interface CardProps {
    image: any;
    title: string;
    subtitle: string;
}

const Card:  React.FC<CardProps>  = ({ image, title, subtitle }) => {
    return (
        <div className={styles.card}>
            {<span className={styles.cardImage}>{image}</span>}
            <div className={styles.cardContent}>
                <h3 className={styles.cardTitle}>{title}</h3>
                <p className={styles.cardSubtitle}>{subtitle}</p>
            </div>
        </div>
    );
};


export default Card;
