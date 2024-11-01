import axios from "axios";

export const updateCacheWithSelection = async (userId: any, selectedSkin: any, token: any) => {
    try {
        await axios.put(`https://miningodyssey.pw/users/${userId}/selection`, {
            selectedSkin: selectedSkin
        }, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            }
        });
    } catch (error) {
        console.error('Ошибка при обновлении кэша:', error);
    }
};