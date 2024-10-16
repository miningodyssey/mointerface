import axios from "axios";

export const updateUser = async (updatedUserData: any, token: string) => {
    try {
        const response = await axios.put(
            `https://miningodyssey.pw/users/update/${updatedUserData.id}`,  // URL запроса
            updatedUserData,  // Все данные пользователя отправляем на сервер
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user:', error);
    }
};
