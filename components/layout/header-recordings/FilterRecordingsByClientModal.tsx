import React, { useMemo } from "react";
import FilterModal from "../../shared/filter-select/DataFiltersSearchable";
import { SelectOption } from "../../ui/select/Select";
import { useRecordings } from "@/components/providers/RecordingsProvider";

interface Props {
  isVisible: boolean;
  onClose: () => void;
}

export default function FilterRecordingsByClientModal({
  isVisible,
  onClose,
}: Props) {
  const { allRecordings, clientFilter, toggleClientFilter } = useRecordings();

  const filterOptions: SelectOption[] = useMemo(() => {
    if (!allRecordings) return [];

    const clientMap = new Map<number, { label: string; value: string }>();

    allRecordings.forEach((recording) => {
      if (!clientMap.has(recording.clientId)) {
        clientMap.set(recording.clientId, {
          label: recording.clientName,
          value: recording.clientId?.toString(),
        });
      }
    });

    return Array.from(clientMap.values());
  }, [allRecordings]);

  return (
    <FilterModal
      isVisible={isVisible}
      onClose={onClose}
      items={filterOptions}
      hasAnyItems={allRecordings && allRecordings?.length > 0}
      selectedValue={clientFilter?.value}
      getLabel={(item) => item.label}
      getValue={(item) => item.value}
      onSelect={toggleClientFilter}
      title="Filter Recordings by Client"
      placeholder="Search clients"
    />
  );
}
