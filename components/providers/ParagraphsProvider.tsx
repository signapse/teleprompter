import React, { createContext, useContext, useMemo, useState } from "react";
import useGetParagraphs from "@/hooks/api/useGetParagraphs";
import { IParagraph } from "@/types/paragraph";
import { useUser } from "./UserProvider";
import { SelectOption } from "../ui/select/Select";

type ParagraphsContextType = {
  allParagraphs: IParagraph[] | undefined;
  paragraphs: IParagraph[];
  isLoading: boolean;
  isFetching: boolean;
  folderFilter: SelectOption | null;
  findOneByVideoLabel: (videoLabel: string) => IParagraph | undefined;
  clientFilter: SelectOption | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  toggleFolderFilter: (opt: SelectOption | null) => void;
  toggleClientFilter: (opt: SelectOption | null) => void;
  refetch: () => void;
  error: Error | null;
};

const ParagraphsContext = createContext<ParagraphsContextType | undefined>(
  undefined
);

export const ParagraphsProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [folderFilter, setFolderFilter] = useState<SelectOption | null>(null);
  const [clientFilter, setClientFilter] = useState<SelectOption | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const { userMetadata } = useUser();
  const {
    data: allParagraphs,
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetParagraphs({
    params: {
      clientId: (clientFilter?.value as string) || undefined,
      folder: (folderFilter?.value as string) || undefined,
      query: searchQuery,
      assignedUserId: userMetadata?.id
    },
  });

  // Filter paragraphs based on `folder`, `clientId`, and `searchQuery` locally
  const filteredParagraphs = useMemo(() => {
    if (!allParagraphs?.data) return [];

    return allParagraphs.data.filter((paragraph) => {
      const matchesFolder = folderFilter
        ? paragraph.folder === folderFilter.value
        : true;
      const matchesClient = clientFilter
        ? paragraph.client.id === parseInt(clientFilter.value as string, 10)
        : true;
      const matchesSearch = searchQuery
        ? paragraph.videoLabel.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      return matchesFolder && matchesClient && matchesSearch;
    });
  }, [
    allParagraphs?.data,
    folderFilter?.value,
    clientFilter?.value,
    searchQuery,
    userMetadata?.id,
  ]);

  const toggleFolderFilter = (opt: SelectOption | null) => {
    if (opt?.value === folderFilter?.value) {
      setFolderFilter(null);
    } else {
      setFolderFilter(opt);
    }
  };

  const toggleClientFilter = (opt: SelectOption | null) => {
    if (opt?.value === clientFilter?.value) {
      setClientFilter(null);
    } else {
      setClientFilter(opt);
    }
  };

  const findOneByVideoLabel = (videoLabel: string) => {
    return allParagraphs?.data?.find((item) => item.videoLabel === videoLabel);
  };

  return (
    <ParagraphsContext.Provider
      value={{
        allParagraphs: allParagraphs?.data,
        paragraphs: filteredParagraphs,
        isLoading,
        isFetching,
        refetch,
        error,
        clientFilter,
        findOneByVideoLabel,
        toggleFolderFilter,
        toggleClientFilter,
        folderFilter,
        searchQuery,
        setSearchQuery,
      }}
    >
      {children}
    </ParagraphsContext.Provider>
  );
};

export const useParagraphs = (): ParagraphsContextType => {
  const context = useContext(ParagraphsContext);
  if (!context) {
    throw new Error("useParagraphs must be used within a ParagraphsProvider");
  }
  return context;
};
