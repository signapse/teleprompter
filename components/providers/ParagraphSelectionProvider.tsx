import React, { createContext, useContext, useEffect, useState } from "react";
import { IParagraph } from "@/types/paragraph";
import useGetParagraphs from "@/hooks/api/useGetParagraphs";
import { useParagraphs } from "./ParagraphsProvider";

interface SelectionContextType {
  activeItemPosition: number;
  activeItem: IParagraph | undefined;
  selection: IParagraph[];
  toggleParagraphSelection: (paragraph: IParagraph) => void;
  clearSelection: () => void;
  selectMany: (paragraphs: IParagraph[]) => void;
  selectOne: (paragraph: IParagraph) => void;
  hasNextAvailableItem: boolean;
  getNextItem: () => void;
  getPreviousItem: () => void;
  clearActiveItem: () => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export const ParagraphSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selection, setSelection] = useState<IParagraph[]>([]);

  const [activeItemPosition, setActiveItemPosition] = useState(0);

  const { allParagraphs, clientFilter, folderFilter } = useParagraphs();

  const getNextItem = () => {
    if (hasNextAvailableItem) {
      setActiveItemPosition((prev) => prev + 1);
    }
  };

  const getPreviousItem = () => {
    if (hasPreviousAvailableItem) {
      setActiveItemPosition((prev) => prev - 1);
    }
  };

  const hasPreviousAvailableItem = Boolean(
    selection.length && activeItemPosition > 0
  );
  const hasNextAvailableItem = Boolean(
    selection.length && activeItemPosition + 1 < selection.length
  );

  useEffect(() => {
    if (selection?.length > 0) {
      setSelection((prev) =>
        prev.filter((item) => {
          // Check if the item matches the clientFilter and folderFilter if they are set
          const matchesClientFilter = clientFilter
            ? item.client.id === parseInt(clientFilter.value)
            : true;
          const matchesFolderFilter = folderFilter
            ? item.folder === folderFilter.value
            : true;

          return matchesClientFilter && matchesFolderFilter;
        })
      );
    }
  }, [allParagraphs, clientFilter?.value, folderFilter?.value]);

  const clearSelection = () => {
    setSelection([]);
  };

  const selectMany = (items: IParagraph[]) => {
    setSelection(items);
  };

  const selectOne = (item: IParagraph) => {
    setSelection([item]);
  };

  const toggleParagraphSelection = (item: IParagraph): void => {
    setSelection((prevSelection) => {
      const isSelected = !!prevSelection.find(
        (selectedItem) => selectedItem.id === item.id
      );
      if (isSelected) {
        return prevSelection.filter(
          (selectedItem) => selectedItem.id !== item.id
        );
      } else {
        return [...prevSelection, item];
      }
    });
  };

  const clearActiveItem = () => {
    setActiveItemPosition(0);
  };

  return (
    <SelectionContext.Provider
      value={{
        selection,
        activeItemPosition,
        activeItem: selection[activeItemPosition],
        toggleParagraphSelection,
        clearSelection,
        selectOne,
        selectMany,
        getNextItem,
        getPreviousItem,
        hasNextAvailableItem,
        clearActiveItem,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useParagraphSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useSelectionContext must be used within a SelectionProvider"
    );
  }
  return context;
};
