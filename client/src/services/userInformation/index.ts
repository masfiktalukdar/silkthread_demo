import { apiRequest } from "@/lib/apiRequest";

export const getUserInformation = async (userId: string) => {
  try {
    if (!userId || !/^[a-f\d]{24}$/i.test(userId)) {
      return null;
    }
    const response = await apiRequest({
      endpoint: `/auth/user/${userId}`,
    });
    return response;
  } catch (error) {
    console.error("Error fetching user information:", error);
    return null;
  }
};

export const getUserOrders = async (userId: string) => {
  try {
    if (!userId) return null;
    const response = await apiRequest({
      endpoint: `/order/user/${userId}`,
    });
    return response;
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return null;
  }
};

export const updateUserInformation = async (
  userId: string,
  credentials: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    division?: string;
    district?: string;
    thana?: string;
    fullAddress?: string;
  }
) => {
  try {
    const response = await apiRequest({
      endpoint: `/user/${userId}`,
      method: "PUT",
      body: credentials,
    });
    return response;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
