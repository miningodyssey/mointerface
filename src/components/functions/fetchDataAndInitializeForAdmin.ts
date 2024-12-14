import { initInitData } from "@telegram-apps/sdk";
import axios from "axios";
import {UserType} from "@/types/user.type";
import {CreateUserDTO} from "@/components/functions/fetchDataAndInitialize";


export interface User {
    first_name: string;
    id: number;
    username: string;
    auth_date: number
}

export async function fetchDataAndInitializeForAdmin(userData: User): Promise<{ userId: number, token: string, fetchedUserData: UserType }> {
    try {
        const authData: CreateUserDTO = {
            referer: '0',
            tgUserdata: JSON.stringify(userData),
            registrationDate: String(Date.now()),
        };

        // Отправляем запрос на аутентификацию
        const authResponse = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND}/auth/register/${userData.id}`, authData);
        const token = authResponse.data['access_token'];
        sessionStorage.setItem('token', token);
        // Отправляем запрос на создание пользователя
        const userResponse = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/create/${userData.id}`,
            userData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );

        return { userId: userData.id, token, fetchedUserData: userResponse.data };
    } catch (error) {
        console.error('Error during initialization:', error);
        throw error;
    }
}
