import React from 'react';
import styles from "./task.module.css";
import {Cell} from "@telegram-apps/telegram-ui";
interface TaskProps {
    before: any; // Позиция в списке
    subtitle: any;     // Имя участника
    after: any;
    title: any;
    onClick: any;
    color?: any;
}

interface CSSPropertiesWithVars extends React.CSSProperties {
    [key: string]: any; // Позволяет добавлять любые другие свойства
}

const Task: React.FC<TaskProps> = ({ before, subtitle, after, title, onClick, color }) => {
    const cellStyle: CSSPropertiesWithVars = color ? { '--cell-bg-color': color } : {};
    return (
        <div onClick={onClick} style={{width: '100%', display: 'flex', justifyContent: 'center'}}>
            <Cell
                style={cellStyle}
                className={styles.Cell}
                before={
                    before
                }
                subtitle={subtitle}
                after={
                    after
                }
            >
                <div className={styles.TaskName}>
                    <p>{title}</p>
                </div>
            </Cell>
        </div>
    );
};


export default Task;
