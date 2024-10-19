import { initInitData } from "@telegram-apps/sdk";
import axios from "axios";

export type CreateUserDTO = {
    referer: string;  // Обязательное поле
    tgUserdata: string;  // Обязательное поле
    registrationDate: string;
};


export async function fetchDataAndInitialize() {
    try {
        const data = initInitData();
        const userId = data?.user?.id || 0;

        const userData: CreateUserDTO = {
            referer: data?.startParam || '0',
            tgUserdata: JSON.stringify(data?.user),
            registrationDate: String(Date.now()),
        };

        // Отправляем запрос на аутентификацию
        const authResponse = await axios.post(`https://miningodyssey.pw/auth/register/${userId}`, userData);
        const token = authResponse.data['access_token'];

        // Отправляем запрос на создание пользователя
        const userResponse = await axios.post(
            `https://miningodyssey.pw/users/create/${userId}`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return { userId, token, fetchedUserData: userResponse.data };
    } catch (error) {
        console.error('Error during initialization:', error);
        throw error;
    }
}
