import React from 'react';
import styles from "./task.module.css";
import {Cell} from "@telegram-apps/telegram-ui";
interface TaskProps {
    before: any; // Позиция в списке
    subtitle: any;     // Имя участника
    after: any;
    title: any;
}

const Task: React.FC<TaskProps> = ({ before, subtitle, after, title }) => {
    return (
        <Cell
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
    );
};


export default Task;
