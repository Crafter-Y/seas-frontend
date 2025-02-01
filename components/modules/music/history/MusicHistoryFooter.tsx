import React from "react";
import { DataTable } from "react-native-paper";

import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { HistoryType } from "@/components/modules/music/MusicHistoryModal";
import tw from "@/tailwind";

type Props = {
  page: number;
  numPages: number;
  responseLength: number;
  setPage: (page: number) => void;
  queryReports: (
    searchType: MusicEntryType,
    historyType: HistoryType,
    page: number,
  ) => void;
  searchType: MusicEntryType;
  historyType: HistoryType;
  totalRecords: number;
};

export default function MusicHistoryFooter({
  page,
  numPages,
  setPage,
  queryReports,
  searchType,
  historyType,
  responseLength,
  totalRecords,
}: Props) {
  return (
    <DataTable style={tw`${responseLength ? "" : "hidden"}`}>
      <DataTable.Pagination
        page={page}
        numberOfPages={numPages}
        onPageChange={(page) => {
          setPage(page);
          queryReports(searchType, historyType, page);
        }}
        label={`${page * 10 + 1}-${
          page * 10 + responseLength
        } von ${totalRecords}`}
        showFastPaginationControls
        numberOfItemsPerPage={responseLength}
      />
    </DataTable>
  );
}
