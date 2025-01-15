import tw from "@/tailwind";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { MusicEntryType } from "./MusicEntryTypeModal";
import useSongHistory from "@/hooks/api/useSongHistory";
import { Color } from "@/helpers/Constants";
import { prettyDate } from "@/helpers/format";
import Ratings, { Rating, ratingMeaning } from "@/components/elements/Ratings";
import MusicHistoryList from "./history/MusicHistoryList";
import CustomText from "@/components/elements/CustomText";

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

  const [searchType, setSearchType] = useState<MusicEntryType>("MISSION");
  const [historyType, setHistoryType] = useState<HistoryType>("HISTORY");
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
    queryReports(searchType, historyType, 0);
  }, [searchType, historyType]);

  return (
    <View style={tw`mx-2 md:mx-4`}>
      {/* History Component */}
      {historyType === "HISTORY" && (
        <MusicHistoryList
          data={historyResponse}
          headers={["Datum", "Eintrag"]}
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
                style={tw`border-b-2 p-1 flex-row border-[${Color.GRAY}] ${
                  index == 0 ? "border-t-2" : ""
                } ${index % 2 == 0 ? "bg-gray-100" : ""}`}
              >
                <View style={tw``}>
                  {/* TODO: figure out, why the date needs to be casted to the date object */}
                  {new Date(item.date).getFullYear() !==
                    new Date().getFullYear() && (
                    <CustomText>{new Date(item.date).getFullYear()}</CustomText>
                  )}
                  <CustomText style={tw`mr-3`}>
                    {prettyDate(item.date.toString(), true)}
                  </CustomText>
                </View>
                <View style={tw`flex-1`}>
                  <CustomText style={tw`text-lg leading-[18px]`}>
                    {item.song.title} ({item.song.number})
                  </CustomText>
                  <CustomText style={tw`text-xs`}>
                    {item.song.book.name}
                  </CustomText>
                  {item.comment && (
                    <CustomText style={tw`text-base mt-1`}>
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
      {(historyType === "GOOD" || historyType == "BAD") && (
        <MusicHistoryList
          data={ratingResponse}
          headers={["Eintrag", "Bewertung"]}
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
                style={tw`border-b-2 p-1 flex-row border-[${Color.GRAY}] ${
                  index == 0 ? "border-t-2" : ""
                } ${index % 2 == 0 ? "bg-gray-100" : ""}`}
              >
                <View style={tw`flex-1`}>
                  <CustomText style={tw`text-lg leading-[18px]`}>
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText style={tw`text-xs`}>{item.book}</CustomText>
                </View>
                <View style={tw`flex-1 items-center justify-center`}>
                  <Ratings
                    key={item.rating}
                    size="small"
                    initialValue={(item.rating + "") as Rating}
                    frozen
                  />
                  <CustomText style={tw`text-center`}>
                    {(item.rating + "").replace(".", ",")} Sterne
                  </CustomText>
                  <CustomText style={tw`text-center px-1 text-xs`}>
                    {ratingMeaning[(item.rating + "") as Rating]}
                  </CustomText>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Counts Component */}
      {(historyType === "MIN" || historyType == "MAX") && (
        <MusicHistoryList
          data={countResponse}
          headers={["Eintrag", "# oft vorgetragen"]}
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
                style={tw`border-b-2 p-1 flex-row border-[${Color.GRAY}] ${
                  index == 0 ? "border-t-2" : ""
                } ${index % 2 == 0 ? "bg-gray-100" : ""}`}
              >
                <View style={tw`flex-1`}>
                  <CustomText style={tw`text-lg leading-[18px]`}>
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText style={tw`text-xs`}>{item.book}</CustomText>
                </View>
                <View style={tw`items-center justify-center`}>
                  <CustomText style={tw`text-center text-lg`}>
                    {item.count}x vorgetragen
                  </CustomText>
                </View>
              </View>
            );
          }}
        />
      )}

      {/* Knwon/Unknown list component */}
      {(historyType === "KNOWN" || historyType == "UNKNOWN") && (
        <MusicHistoryList
          data={knownResponse}
          headers={["Titel"]}
          setSearchType={setSearchType}
          searchType={searchType}
          setHistoryType={setHistoryType}
          historyType={historyType}
          page={page}
          responseLength={historyType == "KNOWN" ? knownResponse.length : 0}
          setPage={setPage}
          queryReports={queryReports}
          totalRecords={totalRecords}
          renderItem={({ item, index }) => {
            return (
              <View
                style={tw`border-b-2 p-1 flex-row border-[${Color.GRAY}] ${
                  index == 0 ? "border-t-2" : ""
                } ${index % 2 == 0 ? "bg-gray-100" : ""}`}
              >
                <View style={tw`flex-1`}>
                  <CustomText style={tw`text-lg leading-[18px]`}>
                    {item.title} ({item.number})
                  </CustomText>
                  <CustomText style={tw`text-xs`}>{item.book.name}</CustomText>
                </View>
              </View>
            );
          }}
        />
      )}
      <View style={tw`h-2`}></View>
    </View>
  );
}
