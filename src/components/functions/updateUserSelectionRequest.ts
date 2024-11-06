import axios from "axios";

export const updateUserSelectionRequest = async (userId: any, selectedSkin: any, selectedUpgrade: any, token: any) => {
    try {
        const response = await axios.put(
            `https://miningodyssey.pw/users/${userId}/selection`,
            { selectedSkin, selectedUpgrade },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user selection:', error);
    }
};
