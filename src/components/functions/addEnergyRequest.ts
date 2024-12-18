import axios from "axios";

export const addEnergyRequest = async (userId: number, amount: number) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await axios.post(
            `https://miningodyssey.pw/users/${userId}/add-energy`,
            { amount: amount }, // Передаем количество добавляемой энергии
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
