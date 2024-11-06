import { initInitData } from "@telegram-apps/sdk";
import axios from "axios";

export type UpdateTaskDTO = {
    taskId: string;
    progress: number;
    userId: string | number;
};

export async function updateTask(taskId: string, progress: number) {
    try {
        const data = initInitData();
        const userId = data?.user?.id || 0;

        const taskData: UpdateTaskDTO = {
            taskId,
            progress,
            userId,
        };

        const response = await axios.patch(
            `https://miningodyssey.pw/tasks/progress/${taskId}`,
            {
                userId,
                increment: progress,
            },
            {
                headers: {
                    'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error during task update:', error);
        throw error;
    }
}
