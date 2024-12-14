import axios from "axios";

export const updateUserSelectionRequest = async (userId: any, selectedSkin: any, selectedUpgrade: any, token: any) => {
    try {
        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/${userId}/selection`,
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
