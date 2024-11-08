import axios from "axios";

export const updateUserSettings = async (userId: number, newSettings: Record<string, string>) => {
    try {
        const token = sessionStorage.getItem("token");

        const response = await axios.put(
            `https://miningodyssey.pw/users/${userId}/settings`,
            newSettings,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating user settings:', error);
    }
};
