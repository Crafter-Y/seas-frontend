import AntDesign from "@expo/vector-icons/AntDesign";
import * as FileSystem from "expo-file-system";
import { isAvailableAsync, shareAsync } from "expo-sharing";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, Pressable, Share, View } from "react-native";

import CustomText from "@/components/elements/CustomText";
import Ratings, { Rating, ratingMeaning } from "@/components/elements/Ratings";
import MusicHistoryList from "@/components/modules/music/history/MusicHistoryList";
import { MusicEntryType } from "@/components/modules/music/MusicEntryTypeModal";
import { prettyDate } from "@/helpers/format";
import useSongHistory from "@/hooks/api/useSongHistory";

export type HistoryType =
  | "GOOD"
  | "BAD"
  | "MIN"
  | "MAX"
  | "HISTORY"
  | "KNOWN"
  | "UNKNOWN";

export default function MusicHistoryModal() {
  const {
    queryReports,
    historyResponse,
    ratingResponse,
    totalRecords,
    countResponse,
    knownResponse,
  } = useSongHistory();
  const { t } = useTranslation();

  const [searchType, setSearchType] = useState<MusicEntryType>("MISSION");
  const [historyType, setHistoryType] = useState<HistoryType>("HISTORY");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    queryReports(searchType, historyType, 0);
  }, [searchType, historyType, queryReports]);

  const exportCsv = async (data: APIResponseSong[]) => {
    const csvString = [
      "Number;Title;Book Name",
      ...data.map((song) => `${song.number};${song.title};${song.book.name}`),
    ].join("\n");

    const csvWithBOM = "\uFEFF" + csvString;

    if (Platform.OS === "web") {
      // Add UTF-8 BOM to fix special characters
      const blob = new Blob([csvWithBOM], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "unknown.csv";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      // Mobile: Save file and share
      const fileUri = FileSystem.cacheDirectory + "unknown.csv";
      await FileSystem.writeAsStringAsync(fileUri, csvWithBOM, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      if (await isAvailableAsync()) {
        await shareAsync(fileUri);
      } else {
        await Share.share({ url: fileUri });
      }
    }
  };

  return (
    <View className="mx-2 md:mx-4">
      {/* History Component */}
      {historyType === "HISTORY" && (
        <MusicHistoryList
          data={historyResponse}
          headers={[t("date"), t("entry")]}
          setSearchType={setSearchType}
          searchType={searchType}
          setHistoryType={setHistoryType}
          historyType={historyType}
          responseLength={historyResponse.length}
          page={page}
          setPage={setPage}
          queryReports={queryReports}
          totalRecords={totalRecords}
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 flex-row border-seas-gray ${
                  index === 0 ? "border-t-2" : ""
                } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <View>
                  {item.date.getFullYear() !== new Date().getFullYear() && (
                    <CustomText>{item.date.getFullYear()}</CustomText>
                  )}
                  <CustomText className="mr-3">
                    {prettyDate(item.date.toString(), true)}
                  </CustomText>
                </View>
                <View className="flex-1">
                  <CustomText className="text-lg leading-[18px]">
                    {item.song.title} ({item.song.number})
                  </CustomText>
                  <CustomText className="text-xs">
                    {item.song.book.name}
                  </CustomText>
                  {item.comment && (
                    <CustomText className="mt-1 text-base">
                      {item.comment}
                    </CustomText>
                  )}
                  <Ratings
                    size="small"
                    initialValue={(item.rating + "") as Rating}
                    frozen
                  />
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Ratings Component */}
      {(historyType === "GOOD" || historyType === "BAD") && (
        <MusicHistoryList
          data={ratingResponse}
          headers={[t("entry"), t("rating")]}
          setSearchType={setSearchType}
          searchType={searchType}
          setHistoryType={setHistoryType}
          historyType={historyType}
          page={page}
          responseLength={ratingResponse.length}
          setPage={setPage}
          queryReports={queryReports}
          totalRecords={totalRecords}
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 flex-row border-seas-gray ${
                  index === 0 ? "border-t-2" : ""
                } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <View className="flex-1 justify-center">
                  <CustomText className="text-lg leading-[18px]">
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText className="text-xs">{item.book}</CustomText>
                </View>
                <View className="items-center justify-center flex-1">
                  <Ratings
                    key={item.rating}
                    size="small"
                    initialValue={(item.rating + "") as Rating}
                    frozen
                  />
                  <CustomText
                    className="text-center"
                    t="xStars"
                    values={{ x: (item.rating + "").replace(".", ",") }}
                  />
                  <CustomText className="text-center px-1 text-xs">
                    {/* TODO: i18n translate ratings */}
                    {ratingMeaning[(item.rating + "") as Rating]}
                  </CustomText>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Counts Component */}
      {(historyType === "MIN" || historyType === "MAX") && (
        <MusicHistoryList
          data={countResponse}
          headers={[t("entry"), t("timesPerformed", { times: " " })]}
          setSearchType={setSearchType}
          searchType={searchType}
          setHistoryType={setHistoryType}
          historyType={historyType}
          responseLength={countResponse.length}
          page={page}
          setPage={setPage}
          queryReports={queryReports}
          totalRecords={totalRecords}
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 flex-row border-seas-gray ${
                  index === 0 ? "border-t-2" : ""
                } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <View className="flex-1">
                  <CustomText className="text-lg leading-[18px]">
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText className="text-xs">{item.book}</CustomText>
                </View>
                <View className="items-center justify-center">
                  <CustomText
                    className="text-center text-lg"
                    t="timesPerformed"
                    values={{ times: item.count + "" }}
                  />
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Knwon/Unknown list component */}
      {(historyType === "KNOWN" || historyType === "UNKNOWN") && (
        <MusicHistoryList
          data={knownResponse}
          headers={[t("title")]}
          setSearchType={setSearchType}
          searchType={searchType}
          setHistoryType={setHistoryType}
          historyType={historyType}
          page={page}
          responseLength={historyType === "KNOWN" ? knownResponse.length : 0}
          setPage={setPage}
          queryReports={queryReports}
          totalRecords={totalRecords}
          csvExportButton={
            historyType === "KNOWN" ? undefined : (
              <View className="mt-1 items-end">
                <Pressable
                  className="items-center justify-center p-2 rounded-full border border-gray-400 hover:bg-seas-light-gray"
                  onPress={() => exportCsv(knownResponse)}
                >
                  <AntDesign name="table" size={22} color="black" />
                </Pressable>
              </View>
            )
          }
          renderItem={({ item, index }) => {
            return (
              <View
                className={`border-b-2 p-1 flex-row border-seas-gray ${
                  index === 0 ? "border-t-2" : ""
                } ${index % 2 === 0 ? "bg-gray-100" : ""}`}
              >
                <View>
                  <CustomText className="text-lg leading-[18px]">
                    {item.title}
                  </CustomText>
                  <CustomText>({item.number})</CustomText>
                  <CustomText className="text-xs">{item.book.name}</CustomText>
                </View>
              </View>
            );
          }}
        />
      )}
      <View className="h-2"></View>
    </View>
  );
}
