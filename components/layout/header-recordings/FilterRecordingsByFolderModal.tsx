import React, { useMemo } from "react";
import FilterModal from "../../shared/filter-select/DataFiltersSearchable";
import { SelectOption } from "../../ui/select/Select";
import { useRecordings } from "@/components/providers/RecordingsProvider";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function FilterRecordingsByFolderModal({
  isVisible,
  onClose,
}: Props) {
  const { allRecordings, folderFilter, toggleFolderFilter } = useRecordings();

  const filterOptions: SelectOption[] = useMemo(() => {
    if (!allRecordings) return [];

    const foldersMap = new Map<string, { label: string; value: string }>();

    allRecordings.forEach((recording) => {
      if (!foldersMap.has(recording.folder)) {
        foldersMap.set(recording.folder, {
          label: recording.folder,
          value: recording.folder,
        });
      }
    });

    return Array.from(foldersMap.values());
  }, [allRecordings]);

  return (
    <FilterModal
      isVisible={isVisible}
      onClose={onClose}
      items={filterOptions}
      hasAnyItems={allRecordings && allRecordings?.length > 0}
      selectedValue={folderFilter?.value}
      getLabel={(item) => item.label}
      getValue={(item) => item.value}
      onSelect={toggleFolderFilter}
      title="Filter Recordings by Folder"
      placeholder="Search folders"
    />
  );
}
