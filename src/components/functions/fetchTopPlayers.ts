import axios from "axios";

export const fetchTopPlayers = async (userId: number, token: any) => {
    try {

        const userResponse = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/top/${userId}`,
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

