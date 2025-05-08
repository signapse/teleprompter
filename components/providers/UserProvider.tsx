import React, { createContext, useContext } from "react";
import { useAuth0 } from "react-native-auth0";
import { useQuery } from "@tanstack/react-query";
import userService from "@/lib/api/userService";
import { IUser } from "@/types/user";

interface UserContextProps {
  userMetadata: IUser | undefined;
  isLoading: boolean;
  error: Error | null;
  refetch: () => void;
}

const UserContext = createContext<UserContextProps | undefined>(undefined);

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth0();

  // Fetch user metadata with react-query
  const {
    data: userMetadata,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userMetadata", user?.sub],
    queryFn: () => userService.getUserMetadataByAuthId(user?.sub!!),
    enabled: !!user?.sub, // Only fetch if user and access token are available
    refetchOnWindowFocus: true,
    retry: 2,
  });

  return (
    <UserContext.Provider
      value={{
        userMetadata,
        isLoading,
        error,
        refetch,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextProps => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
