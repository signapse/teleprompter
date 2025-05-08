import React, { useMemo } from "react";
import FilterModal from "../../shared/filter-select/DataFiltersSearchable";
import { useParagraphs } from "../../providers/ParagraphsProvider";
import { SelectOption } from "../../ui/select/Select";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function FilterParagraphsByClientModal({
  isVisible,
  onClose,
}: Props) {
  const { allParagraphs, clientFilter, toggleClientFilter } = useParagraphs();

  const filterOptions: SelectOption[] = useMemo(() => {
    if (!allParagraphs) return [];

    const clientMap = new Map<number, { label: string; value: string }>();

    allParagraphs.forEach((paragraph) => {
      if (!clientMap.has(paragraph.client.id)) {
        clientMap.set(paragraph.client.id, {
          label: paragraph.client.name,
          value: paragraph.client.id.toString(),
        });
      }
    });

    return Array.from(clientMap.values());
  }, [allParagraphs]);

  return (
    <FilterModal
      isVisible={isVisible}
      onClose={onClose}
      items={filterOptions}
      hasAnyItems={allParagraphs && allParagraphs?.length > 0}
      selectedValue={clientFilter?.value}
      getLabel={(item) => item.label}
      getValue={(item) => item.value}
      onSelect={toggleClientFilter}
      title="Filter Paragraphs by Client"
      placeholder="Search clients"
    />
  );
}
