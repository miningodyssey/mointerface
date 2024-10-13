import React from 'react';
import styles from "./header.module.css";

interface ListElementProps {
    left: string; // Позиция в списке
    right: string;   // Очки участника
}

const Header: React.FC<ListElementProps> = ({ left, right }) => {
    return (
        <div className={styles.listElement}>
            <span className={styles.left}>{left}</span>
            <span className={styles.right}>{right}</span>
        </div>
    );
};


export default Header;
