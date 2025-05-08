import { IUser } from "@/types/user";
import apiClient from "./apiClient";
import { handleApiError } from "./apiUtils";

const USERS_SERVICE_API_ENDPOINT = `/v1/user`;

const userService = {
  getUserMetadataByAuthId: async (authId: string): Promise<IUser | void> => {
    const getUserMetadataUrl = `${USERS_SERVICE_API_ENDPOINT}?authId=${authId}`;

    try {
      const response = await apiClient.get<GenericApiObjectResponse<IUser>>(
        getUserMetadataUrl
      );

      return response.data.data;
    } catch (error) {
      handleApiError(error);
    }
  },
};

export default userService;
