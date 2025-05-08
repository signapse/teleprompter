import { useState } from "react";

export const useSelection = <T extends unknown>() => {
  const [selection, setSelection] = useState<T[]>([]);

  const onSelectionChange = (uniqueKey: T): void => {
    setSelection((prevSelection) =>
      prevSelection.includes(uniqueKey)
        ? prevSelection.filter((item) => item !== uniqueKey)
        : [...prevSelection, uniqueKey]
    );
  };

  return {
    selection,
    onSelectionChange,
    clearSelection: () => setSelection([]), // Optional utility to clear selection
  };
};
