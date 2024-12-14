import axios from "axios";

export const updateUser = async (updatedUserData: any) => {
    try {
        const token = sessionStorage.getItem("token");

        if (!token) {
            throw new Error("Token is missing. Please log in first.");
        }

        const response = await axios.put(
            `${process.env.NEXT_PUBLIC_BACKEND}/users/update/${updatedUserData.id}`,
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
