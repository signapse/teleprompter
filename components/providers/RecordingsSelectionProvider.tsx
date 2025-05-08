import React, { createContext, useContext, useEffect, useState } from "react";
import { useParagraphs } from "./ParagraphsProvider";
import { IRecording } from "@/types/recording";

interface SelectionContextType {
  selection: IRecording[];
  toggleRecordingSelection: (recording: IRecording) => void;
  clearSelection: () => void;
  selectMany: (recording: IRecording[]) => void;
  selectOne: (recording: IRecording) => void;
}

const SelectionContext = createContext<SelectionContextType | undefined>(
  undefined
);

export const RecordingsSelectionProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selection, setSelection] = useState<IRecording[]>([]);

  const { clientFilter } = useParagraphs();

  // Filter out recordings that don't belong to the current client when the client changes
  useEffect(() => {
    if (selection?.length > 0 && clientFilter?.value) {
      setSelection((prev) =>
        prev.filter((item) => {
          item.clientId === parseInt(clientFilter.value);
        })
      );
    }
  }, [clientFilter?.value]);

  const clearSelection = () => {
    setSelection([]);
  };

  const selectMany = (items: IRecording[]) => {
    setSelection(items);
  };

  const selectOne = (item: IRecording) => {
    setSelection([item]);
  };

  const toggleRecordingSelection = (item: IRecording): void => {
    setSelection((prevSelection) => {
      const isSelected = !!prevSelection.find(
        (selectedItem) =>
          selectedItem.videoLabel === item.videoLabel &&
          selectedItem.clientId === item.clientId
      );
      if (isSelected) {
        return prevSelection.filter(
          (selectedItem) =>
            selectedItem.videoLabel !== item.videoLabel ||
            selectedItem.clientId !== item.clientId
        );
      } else {
        return [...prevSelection, item];
      }
    });
  };

  return (
    <SelectionContext.Provider
      value={{
        selection,
        toggleRecordingSelection,
        clearSelection,
        selectMany,
        selectOne,
      }}
    >
      {children}
    </SelectionContext.Provider>
  );
};

export const useRecordingsSelectionContext = () => {
  const context = useContext(SelectionContext);
  if (!context) {
    throw new Error(
      "useRecordingsSelectionContext must be used within a SelectionProvider"
    );
  }
  return context;
};
