import axios from "axios";

export const fetchReferals = async (userId: number, token: any) => {
    try {

        const userResponse = await axios.get(
            `https://miningodyssey.pw/users/${userId}/referals`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            })
        return userResponse.data
    } catch (error) {
        console.error('Error fetching top players:', error);
    }
};

