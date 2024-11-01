import { initInitData } from "@telegram-apps/sdk";
import axios from "axios";

export type TaskType = {
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
};

export async function fetchTasks() {
    try {
        const data = initInitData();
        const userId = data?.user?.id || 0;

        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Token is missing. Please log in first.");
        }

        // Запрашиваем задачи для пользователя
        const response = await axios.get<TaskType[]>(`https://miningodyssey.pw/tasks/get/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching tasks:', error);
        throw error;
    }
}
