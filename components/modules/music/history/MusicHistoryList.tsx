import { FlashList, ListRenderItem } from "@shopify/flash-list";
import React from "react";
import { useWindowDimensions, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import MusicHistoryFooter from "@/components/modules/music/history/MusicHistoryFooter";
import MusicHistoryHeader from "@/components/modules/music/history/MusicHistoryHeader";
import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { HistoryType } from "@/components/modules/music/MusicHistoryModal";

type Props = {
  headers: string[];
  setSearchType: (text: MusicEntryType) => void;
  searchType: MusicEntryType;
  setHistoryType: (text: HistoryType) => void;
  historyType: HistoryType;
  page: number;
  totalRecords: number;
  setPage: (page: number) => void;
  queryReports: (
    searchType: MusicEntryType,
    historyType: HistoryType,
    page: number,
  ) => void;
  responseLength: number;
  csvExportButton?: React.ReactElement;
};

export default function MusicHistoryList<T>({
  data,
  renderItem,
  headers,
  setSearchType,
  searchType,
  setHistoryType,
  historyType,
  page,
  setPage,
  queryReports,
  responseLength,
  totalRecords,
  csvExportButton,
}: {
  data: readonly T[];
  renderItem: ListRenderItem<T>;
} & Props) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={{
        height: responseLength === 4 ? height * 0.6 : undefined,
        width: Math.min(350, width - 75), // this bs is done, because otherwise there would be a bug where the layout is wiredly glitching
        marginHorizontal: "auto",
      }}
    >
      <FlashList
        estimatedItemSize={10}
        data={data}
        ListHeaderComponent={
          <>
            <MusicHistoryHeader
              searchType={searchType}
              setSearchType={setSearchType}
              historyType={historyType}
              setHistoryType={setHistoryType}
            />
            {csvExportButton && { ...csvExportButton }}
            <View
              className={`rounded-tl-xl rounded-tr-xl border-t-2 border-l-2 border-r-2 border-seas-gray flex-row p-1 mt-1 ${data.length ? "" : "hidden"}`}
            >
              {headers.map((header) => (
                <View key={header} className="flex-1 mx-2">
                  <CustomText className="text-lg font-semibold">
                    {header}
                  </CustomText>
                </View>
              ))}
            </View>
            <CustomText
              className={`${data.length ? "hidden" : ""} py-2 text-lg`}
              t="noEntryInLast365Days"
            />
          </>
        }
        ListFooterComponent={
          <MusicHistoryFooter
            page={page}
            numPages={Math.ceil(totalRecords / 10)}
            responseLength={responseLength}
            totalRecords={totalRecords}
            setPage={setPage}
            queryReports={queryReports}
            searchType={searchType}
            historyType={historyType}
          />
        }
        renderItem={renderItem}
      />
    </View>
  );
}
