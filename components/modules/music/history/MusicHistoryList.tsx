import { useWindowDimensions, View } from "react-native";
import React from "react";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import MusicHistoryHeader from "./MusicHistoryHeader";
import MusicHistoryFooter from "./MusicHistoryFooter";
import { MusicEntryType } from "../MusicEntryTypeModal";
import { HistoryType } from "../MusicHistoryModal";
import { Color } from "@/helpers/Constants";
import tw from "@/tailwind";
import CustomText from "@/components/elements/CustomText";

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
    page: number
  ) => void;
  responseLength: number;
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
}: {
  data: ReadonlyArray<T>;
  renderItem: ListRenderItem<T>;
} & Props) {
  const { height, width } = useWindowDimensions();

  return (
    <View
      style={tw.style(
        {
          height: responseLength == 4 ? height * 0.6 : undefined,
          width: Math.min(350, width - 75), // this bs is done, because otherwise there would be a bug where the layout is wiredly glitching
        },
        "mx-auto"
      )}
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
            <View
              style={tw`rounded-tl-xl rounded-tr-xl border-t-2 border-l-2 border-r-2 border-[${
                Color.GRAY
              }] flex-row p-1 mt-1 ${data.length ? "" : "hidden"}`}
            >
              {headers.map((header) => (
                <View key={header} style={tw`flex-1 mx-2`}>
                  <CustomText style={tw`text-lg font-semibold`}>
                    {header}
                  </CustomText>
                </View>
              ))}
            </View>
            <CustomText style={tw`${data.length ? "hidden" : ""} py-2 text-lg`}>
              Keine Einträge in den letzten 365 Tagen.
            </CustomText>
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
