import React, { useMemo } from "react";
import FilterModal from "../../shared/filter-select/DataFiltersSearchable";
import { useParagraphs } from "../../providers/ParagraphsProvider";
import { SelectOption } from "../../ui/select/Select";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function FilterParagraphsByFolderModal({
  isVisible,
  onClose,
}: Props) {
  const { allParagraphs, folderFilter, clientFilter, toggleFolderFilter } =
    useParagraphs();

  const filterOptions: SelectOption[] = useMemo(() => {
    if (!allParagraphs) return [];

    const foldersMap = new Map<string, { label: string; value: string }>();

    allParagraphs.forEach((paragraph) => {
      // Check if clientFilter is set and matches the paragraph's client ID
      if (
        (!clientFilter ||
          paragraph.client.id === parseInt(clientFilter.value)) &&
        !foldersMap.has(paragraph.folder)
      ) {
        foldersMap.set(paragraph.folder, {
          label: paragraph.folder,
          value: paragraph.folder,
        });
      }
    });

    return Array.from(foldersMap.values());
  }, [allParagraphs, clientFilter?.value]);

  return (
    <FilterModal
      isVisible={isVisible}
      onClose={onClose}
      hasAnyItems={allParagraphs && allParagraphs?.length > 0}
      items={filterOptions}
      selectedValue={folderFilter?.value}
      getLabel={(item) => item.label}
      getValue={(item) => item.value}
      onSelect={toggleFolderFilter}
      title="Filter Paragraphs by Folder"
      placeholder="Search folders"
    />
  );
}
