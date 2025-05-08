import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { getAllRecordings } from "@/lib/local-storage/videoRecordingStorageHelpers";
import { IRecording } from "@/types/recording";
import { SelectOption } from "../ui/select/Select";

type RecordingsContextType = {
  allRecordings: IRecording[] | undefined;
  recordings: IRecording[];
  isLoading: boolean;
  clientFilter: SelectOption | null;
  folderFilter: SelectOption | null;
  error: Error | null;
  searchQuery: string;
  toggleClientFilter: (opt: SelectOption | null) => void;
  toggleFolderFilter: (opt: SelectOption | null) => void;
  setSearchQuery: (query: string) => void;
  refetch: () => void;
};

const RecordingsContext = createContext<RecordingsContextType | undefined>(
  undefined
);

export const RecordingsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [folderFilter, setFolderFilter] = useState<SelectOption | null>(null);
  const [clientFilter, setClientFilter] = useState<SelectOption | null>(null);

  const [searchQuery, setSearchQuery] = useState<string>("");

  // Fetch function to get all recordings
  const fetchRecordings = async (): Promise<IRecording[]> => {
    const items = await getAllRecordings();

    return items.map((item) => ({
      videoLabel: item.videoLabel,
      videoUri: item.videoUri,
      folder: item.folder,
      clientName: item.clientName,
      clientId: item.clientId,
    }));
  };

  // Setup the useQuery for fetching recordings
  const {
    data: allRecordings,
    isLoading,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["recordings"],
    queryFn: fetchRecordings,
    enabled: false, // Only refetch on focus
  });

  // Filter recordings based on `searchQuery`
  const filteredRecordings = useMemo(() => {
    if (!allRecordings) return [];

    return allRecordings.filter((recording) => {
      const matchesFolder = folderFilter
        ? recording.folder === folderFilter.value
        : true;

      const matchesClient = clientFilter?.value
        ? recording.clientId === parseInt(clientFilter.value, 10)
        : true;

      const matchesSearch = recording.videoLabel
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesFolder && matchesClient && matchesSearch;
    });
  }, [allRecordings, folderFilter, clientFilter, searchQuery]);

  // Use focus effect to refetch when the screen gains focus
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const toggleClientFilter = (opt: SelectOption | null) => {
    if (opt?.value === clientFilter?.value) {
      setClientFilter(null);
    } else {
      setClientFilter(opt);
    }
  };

  const toggleFolderFilter = (opt: SelectOption | null) => {
    if (opt?.value === folderFilter?.value) {
      setFolderFilter(null);
    } else {
      setFolderFilter(opt);
    }
  };

  return (
    <RecordingsContext.Provider
      value={{
        allRecordings,
        recordings: filteredRecordings,
        isLoading,
        error,
        searchQuery,
        folderFilter, // move to reducer
        clientFilter, // move to reducer
        toggleClientFilter,
        toggleFolderFilter,
        setSearchQuery,
        refetch,
      }}
    >
      {children}
    </RecordingsContext.Provider>
  );
};

export const useRecordings = (): RecordingsContextType => {
  const context = useContext(RecordingsContext);
  if (!context) {
    throw new Error("useRecordings must be used within a RecordingsProvider");
  }
  return context;
};
