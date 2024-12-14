'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import styles from './admin.module.css';
import { Button, Input } from "@telegram-apps/telegram-ui";
import { useRouter } from 'next/navigation';
import TelegramLoginWidget from "@/components/TelegramLoginWidget/TelegramLoginWidget";
import { fetchDataAndInitializeForAdmin } from "@/components/functions/fetchDataAndInitializeForAdmin";

const CreateTaskPage = () => {
    const { register, handleSubmit, reset } = useForm();
    const router = useRouter();
    const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<any>();
    const [telegramUser, setTelegramUser] = useState<any>(null);

    // Этот useEffect срабатывает только после того, как telegramUser не равен null
    useEffect(() => {
        if (!telegramUser) return; // Если данных пользователя нет, то ничего не делаем

        const initializeData = async () => {
            const data = await fetchDataAndInitializeForAdmin(telegramUser);
            const admin = data.fetchedUserData.admin;
            setUserData(data.fetchedUserData);
            setIsAdmin(admin);
            setLoading(false);
        };

        initializeData();
    }, [telegramUser]); // Следим только за изменением telegramUser

    useEffect(() => {
        if (loading) return;
        if (isAdmin === false && !loading) {
            router.push('/');
        }
    }, [isAdmin, loading, router]);

    const onSubmit = async (data: any) => {
        try {
            const response = await axios.post('https://mobackend.vercel.app/tasks', data, {
                headers: {
                    Authorization: `Bearer ${sessionStorage.getItem('token')}`,
                },
            });

            alert('Task created successfully!');
            reset();
        } catch (error) {
            console.error('Error creating task:', error);
            alert('Failed to create task. Please try again.');
        }
    };

    if (isAdmin === null || !userData || loading) {
        return (
            <div>
                <TelegramLoginWidget telegramUser={telegramUser} setTelegramUser={setTelegramUser} />
            </div>
        );
    }

    return (
        isAdmin && !loading && (
            <div className={styles.pageContainer}>
                <h1>Create a New Task</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
                    <div className={styles.formGroup}>
                        <label>Reward:</label>
                        <Input
                            type="number"
                            {...register('reward', { required: true })}
                            placeholder="Enter reward"
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Task Title:</label>
                        <Input
                            type="text"
                            {...register('taskTitle', { required: true })}
                            placeholder="Enter task title"
                            className={styles.textarea}
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Task Description:</label>
                        <textarea
                            {...register('taskDescription', { required: true })}
                            placeholder="Enter task description"
                            className={styles.textarea}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Image Link (optional):</label>
                        <input
                            type="text"
                            {...register('imageLink')}
                            placeholder="Enter image link"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Task Link (optional):</label>
                        <input
                            type="text"
                            {...register('taskLink')}
                            placeholder="Enter task link"
                            className={styles.input}
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Type:</label>
                        <select {...register('type', { required: true })} className={styles.select}>
                            <option value="regular">Regular</option>
                            <option value="daily">Daily</option>
                            <option value="temporary">Temporary</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Start Date (optional):</label>
                        <input type="date" {...register('startDate')} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>End Date (optional):</label>
                        <input type="date" {...register('endDate')} className={styles.input} />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Action Type:</label>
                        <select {...register('actionType', { required: true })} className={styles.select}>
                            <option value="click">Click</option>
                            <option value="points">Points</option>
                            <option value="invite">Invite Friends</option>
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Target Value:</label>
                        <Input
                            type="number"
                            {...register('targetValue', { required: true })}
                            placeholder="Enter target value"
                            className={styles.input}
                        />
                    </div>

                    <Button type="submit" className={styles.submitButton}>Create Task</Button>
                </form>
            </div>
        )
    );
}

export default CreateTaskPage;
