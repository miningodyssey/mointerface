import axios from "axios";

export async function updateTopAfterRun(userId: string, coinsEarned: number, record: number) {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Token is missing. Please log in first.");
        }

        const response = await axios.put(
            `https://miningodyssey.pw/users/updatetop/${userId}`,
            { coins: coinsEarned, record: record },
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error("Error updating top after run:", error);
        throw error;
    }
}
