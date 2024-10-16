import axios from "axios";

export const addEnergyRequest = async (userId: number, token: any) => {
    try {
        const response = await axios.post(
            `https://miningodyssey.pw/users/${userId}/add-energy`,
            { amount: 1 }, // Передаем количество добавляемой энергии
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating energy:', error);
    }
};
