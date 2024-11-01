import axios from "axios";

export const updateUser = async (updatedUserData: any, token: string) => {
    try {
        const response = await axios.put(
            `https://miningodyssey.pw/users/update/${updatedUserData.id}`,
            updatedUserData,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data && error.response.data.message) {
            throw new Error(error.response.data.message);
        } else if (error.request) {
            throw new Error("Network error: Unable to reach the server.");
        } else {
            throw new Error("An unexpected error occurred while updating the user.");
        }
    }
};
