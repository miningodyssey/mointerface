import React, { useState, useEffect, useCallback } from "react";
import styles from "./tasks.module.css";
import { motion } from "framer-motion";
import { TabsList, Modal, Placeholder, Button } from "@telegram-apps/telegram-ui";
import Task from "@/categories/tasks/task/task";
import { fetchTasks } from "@/components/functions/fetchTasks";
import { updateTask } from "@/components/functions/updateTask";

interface TasksCategoryProps {
    fadeIn: any;
    utils: any;
    userid: any;
    t: any;
    setUserData: any;
    userData: any;
}

interface TaskType {
    id: string;
    reward: number;
    taskTitle: string;
    taskDescription: string;
    imageLink?: string;
    taskLink?: string;
    type: "regular" | "daily" | "temporary";
    startDate?: number;
    endDate?: number;
    actionType: "click" | "points" | "invite";
    targetValue: number;
}

const TasksCategory: React.FC<TasksCategoryProps> = ({ fadeIn, utils, t, userid, setUserData, userData }) => {
    const [currentTab, setCurrentTab] = useState(0);
    const [tasks, setTasks] = useState<TaskType[]>([]);
    const [completedModalOpen, setCompletedModalOpen] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");

    useEffect(() => {
        const loadTasks = async () => {
            try {
                const fetchedTasks = await fetchTasks();
                setTasks(fetchedTasks);
            } catch (error) {
                console.error("Error in tasks loading:", error);
            }
        };

        loadTasks();
    }, []);

    const handleModalClose = () => {
        setCompletedModalOpen(false);
    };

    const TaskClick = useCallback((task: any, actionType: string) => {
        if (actionType === 'click') {
            if (!task.completed) {
                updateTask(task.id, 1).then(() => {
                    const updatedUserData = userData;
                    updatedUserData.balance = Number(updatedUserData.balance) + Number(task.reward);
                    setUserData(updatedUserData);
                    task.completed = true
                    const msg: string = t("Task") + " " + task.taskTitle + t("completed")
                    setSuccessMessage(msg);
                    setCompletedModalOpen(true);
                });
                try {
                    utils.openTelegramLink(task.taskLink);
                } catch (e) {
                    utils.openLink(task.taskLink, {tryInstantView: true})
                }
            }
        }
        if (actionType === 'points') {
            // Логика для выполнения задания с типом points
        }
        if (actionType === 'invite') {
            const link = `https://t.me/MiningOdysseyBot/Game?startapp=${userid}`;
            if (utils) {
                utils.shareURL(t('InviteMessage'), link);
            }
        }
    }, [userData, utils, setUserData]);

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            className={styles.tasksContainer}
        >
            <div>
                <div className={styles.textContainer}>
                    <h2>{t("Complete tasks and earn points!")}</h2>
                    <p>{t("Check for daily tasks updates")}</p>
                </div>
            </div>
            <div
                style={{
                    height: "42px",
                    width: "100%",
                    display: "flex",
                    justifyContent: "center",
                    marginBottom: "10px",
                }}
            >
                <TabsList style={{ width: "90%", height: "100%" }}>
                    <TabsList.Item
                        selected={currentTab === 0}
                        onClick={() => setCurrentTab(0)}
                    >
                        {t("Active")}
                    </TabsList.Item>
                    <TabsList.Item
                        selected={currentTab === 1}
                        onClick={() => setCurrentTab(1)}
                    >
                        {t("All")}
                    </TabsList.Item>
                </TabsList>
            </div>
            <div className={styles.leaderBoardList}>
                {tasks.map((task) => (
                    <Task
                        key={task.id}
                        before={
                            task.imageLink && (
                                <img
                                    style={{ width: '60px', height: '60px' }}
                                    src={task.imageLink}
                                    alt={task.taskTitle}
                                />
                            )
                        }
                        after={
                            <div>
                                <p className={styles.TaskReward}>{task.reward} PTS</p>
                            </div>
                        }
                        subtitle={
                            <div style={{ color: "var(--tgui--hint_color)" }}>
                                {task.taskDescription}
                            </div>
                        }
                        title={task.taskTitle}
                        onClick={() => TaskClick(task, task.actionType)}
                    >
                    </Task>
                ))}
            </div>

            <Modal
                style={{ zIndex: '9999', flexDirection: 'column-reverse' }}
                open={completedModalOpen}
                onOpenChange={setCompletedModalOpen}
                header={<Modal.Header />}
            >
                <Placeholder
                    header={t("Success!")}
                    description={successMessage}
                    className={styles.modalText}
                >
                    <div className={styles.modalButtons}>
                        <Button onClick={handleModalClose}>{t("Close")}</Button>
                    </div>
                </Placeholder>
            </Modal>
        </motion.div>
    );
};

export default TasksCategory;
