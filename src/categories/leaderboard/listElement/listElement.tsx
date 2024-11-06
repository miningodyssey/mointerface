import React from 'react';
import styles from "./listElement.module.css";

interface ListElementProps {
    position: number; // Позиция в списке
    name: string;     // Имя участника
    points: number;   // Очки участника
}

const ListElement: React.FC<ListElementProps> = ({ position, name, points }) => {
    return (
        <div className={styles.listElement}>
            <span className={styles.position}>#{position}</span>
            <span className={styles.name}>{name}</span>
            <span className={styles.points}>{points.toLocaleString()} pts</span>
        </div>
    );
};


export default ListElement;
