import axios from "axios";

export const updateCacheWithSelection = async (userId: any, selection: any, token: any) => {
    try {
        await axios.put(`${process.env.NEXT_PUBLIC_BACKEND}/users/${userId}/selection`, selection, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Ошибка при обновлении кэша:', error);
    }
};