import React, {useState} from "react";
import styles from "./tasks.module.css";
import {motion} from "framer-motion";
import {Cell, TabsList} from "@telegram-apps/telegram-ui";
import CoinIcon from "@/components/Icons/CoinIcon/CoinIcon";
import Task from "@/categories/tasks/task/task";

interface TasksCategoryProps {
    fadeIn: any;
}

const TasksCategory: React.FC<TasksCategoryProps> = ({
                                                         fadeIn,
                                                     }) => {
    const [currentTab, setCurrentTab] = useState(0);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.tasksContainer}>
            <div>
                <div className={styles.textContainer}>
                    <h2>Complete tasks and earn points!</h2>
                    <p>Check for daily tasks updates</p>
                </div>
            </div>
            <div style={{
                height: '42px',
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '10px'
            }}>
                <TabsList style={{width: '90%', height: '100%'}}>
                    <TabsList.Item selected={currentTab === 0} onClick={() => setCurrentTab(0)}>
                        Active
                    </TabsList.Item>
                    <TabsList.Item selected={currentTab === 1} onClick={() => setCurrentTab(1)}>
                        All
                    </TabsList.Item>
                </TabsList>
            </div>
            <div className={styles.leaderBoardList}>
                <Task
                    before={
                        <div>
                            <CoinIcon/>
                        </div>
                    }
                    after={
                        <div>
                            <p style={{color: 'var(--tgui--text_color)'}}>5,000 PTS</p>
                        </div>
                    }
                    subtitle={
                        <div style={{color: 'var(--tgui--hint_color)'}}>
                            5,000 PTS
                        </div>
                    }
                    title={'Invite friend'}
                />
                <Task
                    before={
                        <div>
                            <CoinIcon/>
                        </div>
                    }
                    after={
                        <div>
                            <p style={{color: 'var(--tgui--text_color)'}}>5,000 PTS</p>
                        </div>
                    }
                    subtitle={
                        <div style={{color: 'var(--tgui--hint_color)'}}>
                            5,000 PTS
                        </div>
                    }
                    title={'Invite friend'}
                />
                <Task
                    before={
                        <div>
                            <CoinIcon/>
                        </div>
                    }
                    after={
                        <div>
                            <p style={{color: 'var(--tgui--text_color)'}}>5,000 PTS</p>
                        </div>
                    }
                    subtitle={
                        <div style={{color: 'var(--tgui--hint_color)'}}>
                            5,000 PTS
                        </div>
                    }
                    title={'Invite friend'}
                />

            </div>
        </motion.div>
    );
};

export default TasksCategory;
